(()=>{
const originalAnalyze=window.analyzePhoto;

function loadTesseract(){
  if(window.Tesseract) return Promise.resolve();
  if(window.__foodTrackerTessLoading) return window.__foodTrackerTessLoading;
  window.__foodTrackerTessLoading=new Promise((resolve,reject)=>{
    const s=document.createElement('script');
    s.src='https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
    s.async=true;
    s.onload=()=>window.Tesseract?resolve():reject(new Error('OCR library failed to load'));
    s.onerror=()=>reject(new Error('OCR library failed to load'));
    document.head.appendChild(s);
  });
  return window.__foodTrackerTessLoading;
}

function note(text){
  const el=document.getElementById('photoNote');
  if(!el) return;
  el.textContent=text;
  el.classList.remove('hidden');
}

function cleanFoodText(text){
  const bad=/^(build it your way|gluten free|subtotal|total|tax|cash|change|visa|mastercard|amex|thank you|receipt|menu|qty|price|amount|server|table|order|date|time)$/i;
  const lines=String(text||'').split(/\r?\n/).map(x=>x.replace(/[•·|]/g,' ').replace(/\s+/g,' ').trim()).filter(Boolean);
  const out=[];
  for(let line of lines){
    line=line.replace(/^[-*•]+\s*/,'').replace(/^\d+\s*[xX]\s*/,'').replace(/\$?\d+[.,]\d{2}\s*$/,'').trim();
    if(line.length<3 || bad.test(line) || /^\d+$/.test(line)) continue;
    line=line.replace(/\((gluten free|gf)\)/ig,'').trim();
    if(line.length<3) continue;
    out.push(line);
  }
  return [...new Set(out)];
}

function looksTextHeavy(rawText,foods){
  const letters=(rawText.match(/[A-Za-z]/g)||[]).length;
  return foods.length>=3 || letters>=45;
}

async function useAsDescription(foods){
  const type=document.getElementById('photoMealType')?.value || 'Breakfast';
  if(typeof closeModal==='function') closeModal('photoModal');
  if(typeof openManual==='function') openManual();
  await new Promise(r=>setTimeout(r,60));
  const mealType=document.getElementById('manualMealType');
  const desc=document.getElementById('mealDescription');
  if(mealType) mealType.value=type;
  if(desc) desc.value=foods.join(', ');
  if(typeof breakDownMeal==='function') breakDownMeal();
}

window.analyzePhoto=async function(){
  const input=document.getElementById('photoInput');
  const file=input?.files?.[0];
  if(!file){alert('Choose a photo first.');return}

  note('Checking whether this is a food photo, receipt, or menu…');
  try{
    await loadTesseract();
    const result=await Tesseract.recognize(file,'eng',{logger:m=>{
      if(m.status==='recognizing text') note(`Reading image text… ${Math.round((m.progress||0)*100)}%`);
    }});
    const raw=result?.data?.text||'';
    const foods=cleanFoodText(raw);
    if(looksTextHeavy(raw,foods)){
      if(!foods.length){note('I found text, but not enough food items. Try a closer photo.');return}
      note(`Found ${foods.length} possible food items. Opening the editable macro breakdown…`);
      await useAsDescription(foods);
      return;
    }
  }catch(e){
    console.warn('OCR check skipped',e);
  }

  if(typeof originalAnalyze==='function') return originalAnalyze();
  note('This looks like a food photo, but photo AI is not connected on this deployment yet.');
};
})();