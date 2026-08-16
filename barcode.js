(()=>{
let stream=null, scanTimer=null, zxingControls=null, scannedItem=null, scanning=false;

function inject(){
  const actions=document.querySelector('.actions');
  if(!actions||document.getElementById('barcodeBtn')) return;
  actions.style.gridTemplateColumns='repeat(3,1fr)';
  const btn=document.createElement('button');
  btn.id='barcodeBtn';btn.className='ghost';btn.textContent='▦ Scan barcode';btn.onclick=openScanner;actions.appendChild(btn);

  const modal=document.createElement('div');
  modal.id='barcodeModal';modal.className='modal';
  modal.innerHTML=`<div class="sheet">
    <div class="sectionhead"><h2 style="margin:0">Scan barcode</h2><button class="ghost" id="barcodeClose">✕</button></div>
    <div class="field"><label>Meal</label><select id="barcodeMealType"><option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Snack</option></select></div>

    <div id="barcodeCameraBox" style="position:relative;background:#090d12;border:1px solid var(--line);border-radius:14px;overflow:hidden;min-height:260px;display:flex;align-items:center;justify-content:center">
      <video id="barcodeVideo" autoplay playsinline muted style="width:100%;height:300px;object-fit:cover"></video>
      <div style="position:absolute;inset:22% 10%;border:3px solid #39d98a;border-radius:16px;pointer-events:none"></div>
      <div id="barcodeCameraMsg" style="position:absolute;bottom:12px;left:12px;right:12px;text-align:center;background:#0009;border-radius:10px;padding:8px;color:#fff;font-size:13px">Starting camera…</div>
    </div>

    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px">
      <button class="ghost" id="barcodeRestart">Live camera</button>
      <button class="ghost" id="barcodePhotoBtn">Take barcode photo</button>
    </div>
    <input id="barcodePhotoInput" type="file" accept="image/*" capture="environment" style="display:none">
    <div id="barcodePhotoPreviewWrap" class="hidden" style="margin-top:10px"><img id="barcodePhotoPreview" alt="Barcode photo" style="width:100%;max-height:260px;object-fit:contain;border-radius:12px;background:#090d12"></div>

    <div class="field"><label>Or enter barcode number</label><div style="display:flex;gap:8px"><input id="barcodeInput" inputmode="numeric" placeholder="UPC / EAN"><button id="barcodeLookup">Look up</button></div></div>
    <div id="barcodeStatus" class="notice hidden"></div>
    <div id="barcodeResult" class="hidden"></div>
  </div>`;

  modal.onclick=e=>{if(e.target===modal)closeScanner()};
  document.body.appendChild(modal);
  document.getElementById('barcodeClose').onclick=closeScanner;
  document.getElementById('barcodeRestart').onclick=startCamera;
  document.getElementById('barcodePhotoBtn').onclick=()=>document.getElementById('barcodePhotoInput').click();
  document.getElementById('barcodePhotoInput').onchange=decodeBarcodePhoto;
  document.getElementById('barcodeLookup').onclick=()=>lookupBarcode(document.getElementById('barcodeInput').value.trim());
}

async function openScanner(){
  document.getElementById('barcodeModal').classList.add('open');
  resetResult();
  await startCamera();
}

async function startCamera(){
  stopCamera();
  const video=document.getElementById('barcodeVideo');
  video.style.display='block';
  document.getElementById('barcodePhotoPreviewWrap').classList.add('hidden');
  setCameraMsg('Starting camera…');
  scanning=true;

  try{
    if('BarcodeDetector' in window){
      const supported=await BarcodeDetector.getSupportedFormats();
      const formats=['ean_13','ean_8','upc_a','upc_e','code_128'].filter(x=>supported.includes(x));
      if(formats.length){
        stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:720}},audio:false});
        video.srcObject=stream;await video.play();
        const detector=new BarcodeDetector({formats});
        setCameraMsg('Point the camera at the barcode');
        scanTimer=setInterval(async()=>{
          if(!scanning) return;
          try{const codes=await detector.detect(video);if(codes.length)foundBarcode(codes[0].rawValue)}catch{}
        },350);
        return;
      }
    }
    await startZXing(video);
  }catch(e){
    console.error('Barcode camera error',e);
    setCameraMsg('Live camera could not start. Use “Take barcode photo” below.');
    showStatus('Live scanning is blocked on this browser. Tap “Take barcode photo” — it uses your phone camera app instead.');
  }
}

function loadZXing(){
  if(window.ZXingBrowser) return Promise.resolve();
  if(window.__zxingLoading) return window.__zxingLoading;
  window.__zxingLoading=new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/@zxing/browser@0.2.0/umd/zxing-browser.min.js';
    s.async=true;
    s.onload=()=>window.ZXingBrowser?resolve():reject(new Error('ZXing did not load'));
    s.onerror=()=>reject(new Error('ZXing failed to load'));
    document.head.appendChild(s);
  });
  return window.__zxingLoading;
}

async function startZXing(video){
  await loadZXing();
  if(!navigator.mediaDevices?.getUserMedia) throw new Error('Camera access is unavailable');
  const reader=new ZXingBrowser.BrowserMultiFormatReader(undefined,{delayBetweenScanAttempts:250,delayBetweenScanSuccess:800});
  setCameraMsg('Point the camera at the barcode');
  zxingControls=await reader.decodeFromConstraints(
    {video:{facingMode:{ideal:'environment'},width:{ideal:1280},height:{ideal:720}},audio:false},
    video,
    result=>{if(result&&scanning){const text=typeof result.getText==='function'?result.getText():String(result.text||result);foundBarcode(text)}}
  );
}

async function decodeBarcodePhoto(){
  const input=document.getElementById('barcodePhotoInput');
  const file=input.files&&input.files[0];
  if(!file) return;
  stopCamera();
  showStatus('Reading barcode from photo…');
  const url=URL.createObjectURL(file);
  const preview=document.getElementById('barcodePhotoPreview');
  preview.src=url;
  document.getElementById('barcodePhotoPreviewWrap').classList.remove('hidden');
  document.getElementById('barcodeVideo').style.display='none';
  setCameraMsg('Reading barcode photo…');
  try{
    await loadZXing();
    const reader=new ZXingBrowser.BrowserMultiFormatReader();
    const result=await reader.decodeFromImageUrl(url);
    const code=typeof result.getText==='function'?result.getText():String(result.text||result);
    foundBarcode(code,true);
  }catch(e){
    console.error('Photo barcode decode failed',e);
    setCameraMsg('Could not read barcode from this photo.');
    showStatus('I could not read that barcode. Try again closer, keep the barcode flat, fill most of the frame, and avoid glare.');
  }finally{
    setTimeout(()=>URL.revokeObjectURL(url),30000);
    input.value='';
  }
}

function foundBarcode(code,fromPhoto=false){
  code=String(code||'').replace(/\D/g,'');
  if(!code) return;
  scanning=false;
  document.getElementById('barcodeInput').value=code;
  setCameraMsg(fromPhoto?'Barcode found in photo ✓':'Barcode found ✓');
  if(navigator.vibrate) navigator.vibrate(80);
  stopCamera(false);
  lookupBarcode(code);
}

function setCameraMsg(t){const el=document.getElementById('barcodeCameraMsg');if(el)el.textContent=t}
function stopCamera(clear=true){
  scanning=false;
  if(scanTimer){clearInterval(scanTimer);scanTimer=null}
  if(zxingControls){try{zxingControls.stop()}catch{}zxingControls=null}
  if(stream){stream.getTracks().forEach(t=>t.stop());stream=null}
  const video=document.getElementById('barcodeVideo');
  if(video?.srcObject){try{video.srcObject.getTracks().forEach(t=>t.stop())}catch{}video.srcObject=null}
}
function closeScanner(){stopCamera();document.getElementById('barcodeModal').classList.remove('open')}
function resetResult(){
  scannedItem=null;
  document.getElementById('barcodeStatus').classList.add('hidden');
  document.getElementById('barcodeResult').classList.add('hidden');
  document.getElementById('barcodeResult').innerHTML='';
  document.getElementById('barcodeInput').value='';
  document.getElementById('barcodePhotoPreviewWrap').classList.add('hidden');
}
function val(o,k){const x=Number(o?.[k]);return Number.isFinite(x)?x:null}
function round(x){return Math.round((Number(x)||0)*10)/10}

async function lookupBarcode(code){
  if(!/^\d{6,14}$/.test(code)){showStatus('Enter a valid barcode number.');return}
  showStatus('Looking up product…');
  try{
    const fields='product_name,brands,serving_size,serving_quantity,nutriments';
    const r=await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(code)}.json?fields=${fields}`);
    if(!r.ok) throw new Error('lookup failed');
    const data=await r.json();
    if(data.status!==1||!data.product){showStatus('Barcode read successfully, but this product is not in the database. You can enter its nutrition below.');renderBlankResult(code);return}
    const p=data.product,nut=p.nutriments||{};
    let servingQty=Number(p.serving_quantity)||null;
    if(!servingQty&&p.serving_size){const m=String(p.serving_size).match(/([\d.]+)\s*g/i);if(m)servingQty=Number(m[1])}
    const mult=servingQty?servingQty/100:1;
    const kcal=val(nut,'energy-kcal_serving')??((val(nut,'energy-kcal_100g')??0)*mult);
    const protein=val(nut,'proteins_serving')??((val(nut,'proteins_100g')??0)*mult);
    const carbs=val(nut,'carbohydrates_serving')??((val(nut,'carbohydrates_100g')??0)*mult);
    const fat=val(nut,'fat_serving')??((val(nut,'fat_100g')??0)*mult);
    scannedItem={name:[p.product_name,p.brands].filter(Boolean).join(' — ')||`Barcode ${code}`,serving:p.serving_size||(servingQty?`${servingQty} g`:'100 g'),cal:round(kcal),p:round(protein),c:round(carbs),f:round(fat)};
    renderResult();showStatus('Product found. Check the serving and macros before saving.');
  }catch(e){
    console.error(e);
    showStatus('Barcode read, but product lookup failed. You can enter the nutrition below.');
    renderBlankResult(code);
  }
}

function renderBlankResult(code){scannedItem={name:`Barcode ${code}`,serving:'1 serving',cal:0,p:0,c:0,f:0};renderResult()}
function showStatus(t){const el=document.getElementById('barcodeStatus');el.textContent=t;el.classList.remove('hidden')}
function renderResult(){
  const x=scannedItem,el=document.getElementById('barcodeResult');el.classList.remove('hidden');
  el.innerHTML=`<div class="foodrow"><div class="field"><label>Food</label><input id="bcName" value="${esc2(x.name)}"></div><div class="field"><label>Serving</label><input id="bcServing" value="${esc2(x.serving)}"></div><div class="nums"><label><small>kcal</small><input id="bcCal" type="number" value="${x.cal}"></label><label><small>P g</small><input id="bcP" type="number" value="${x.p}"></label><label><small>C g</small><input id="bcC" type="number" value="${x.c}"></label><label><small>F g</small><input id="bcF" type="number" value="${x.f}"></label></div></div><button id="bcSave" style="width:100%">Save food</button>`;
  document.getElementById('bcSave').onclick=saveBarcode;
}
function esc2(s=''){return String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
function saveBarcode(){
  if(typeof addMeal!=='function') return;
  const m={type:document.getElementById('barcodeMealType').value,name:document.getElementById('bcName').value.trim()||'Scanned food',serving:document.getElementById('bcServing').value.trim(),cal:Number(document.getElementById('bcCal').value)||0,p:Number(document.getElementById('bcP').value)||0,c:Number(document.getElementById('bcC').value)||0,f:Number(document.getElementById('bcF').value)||0,source:'barcode'};
  addMeal(m);closeScanner();
}

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',inject);else inject();
})();