(()=>{
let stream=null, scanTimer=null, scannedItem=null;
function style(el,obj){Object.assign(el.style,obj);return el}
function inject(){
  const actions=document.querySelector('.actions');
  if(!actions||document.getElementById('barcodeBtn')) return;
  actions.style.gridTemplateColumns='repeat(3,1fr)';
  const btn=document.createElement('button');btn.id='barcodeBtn';btn.className='ghost';btn.textContent='▦ Scan barcode';btn.onclick=openScanner;actions.appendChild(btn);
  const modal=document.createElement('div');modal.id='barcodeModal';modal.className='modal';modal.innerHTML=`<div class="sheet"><div class="sectionhead"><h2 style="margin:0">Scan barcode</h2><button class="ghost" id="barcodeClose">✕</button></div><div class="field"><label>Meal</label><select id="barcodeMealType"><option>Breakfast</option><option>Lunch</option><option>Dinner</option><option>Snack</option></select></div><div id="barcodeCameraBox" style="background:#090d12;border:1px solid var(--line);border-radius:14px;overflow:hidden;min-height:220px;display:flex;align-items:center;justify-content:center"><video id="barcodeVideo" autoplay playsinline muted style="width:100%;max-height:340px;object-fit:cover"></video><div id="barcodeUnsupported" class="muted" style="padding:20px;text-align:center;display:none">Camera barcode detection is not supported by this browser. Enter the barcode below.</div></div><div class="field"><label>Barcode number</label><div style="display:flex;gap:8px"><input id="barcodeInput" inputmode="numeric" placeholder="UPC / EAN"><button id="barcodeLookup">Look up</button></div></div><div id="barcodeStatus" class="notice hidden"></div><div id="barcodeResult" class="hidden"></div></div>`;
  modal.onclick=e=>{if(e.target===modal)closeScanner()};document.body.appendChild(modal);
  document.getElementById('barcodeClose').onclick=closeScanner;
  document.getElementById('barcodeLookup').onclick=()=>lookupBarcode(document.getElementById('barcodeInput').value.trim());
}
async function openScanner(){
  const modal=document.getElementById('barcodeModal');modal.classList.add('open');resetResult();
  if(!('BarcodeDetector' in window)){document.getElementById('barcodeVideo').style.display='none';document.getElementById('barcodeUnsupported').style.display='block';return}
  try{
    const supported=await BarcodeDetector.getSupportedFormats();
    const formats=['ean_13','ean_8','upc_a','upc_e'].filter(x=>supported.includes(x));
    if(!formats.length) throw new Error('No supported food barcode formats');
    stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:'environment'}}});
    const video=document.getElementById('barcodeVideo');video.srcObject=stream;await video.play();
    const detector=new BarcodeDetector({formats});
    scanTimer=setInterval(async()=>{try{const codes=await detector.detect(video);if(codes.length){const code=codes[0].rawValue;document.getElementById('barcodeInput').value=code;stopCamera();lookupBarcode(code)}}catch{}},500);
  }catch(e){document.getElementById('barcodeVideo').style.display='none';document.getElementById('barcodeUnsupported').style.display='block'}
}
function stopCamera(){if(scanTimer){clearInterval(scanTimer);scanTimer=null}if(stream){stream.getTracks().forEach(t=>t.stop());stream=null}}
function closeScanner(){stopCamera();document.getElementById('barcodeModal').classList.remove('open')}
function resetResult(){scannedItem=null;document.getElementById('barcodeStatus').classList.add('hidden');document.getElementById('barcodeResult').classList.add('hidden');document.getElementById('barcodeResult').innerHTML='';document.getElementById('barcodeVideo').style.display='block';document.getElementById('barcodeUnsupported').style.display='none'}
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
    if(data.status!==1||!data.product){showStatus('Product not found. You can still add it with Describe meal.');return}
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
  }catch(e){showStatus('Could not look up this barcode right now. Try again or use Describe meal.')}
}
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