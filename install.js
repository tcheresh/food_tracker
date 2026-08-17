(()=>{
let deferredPrompt=null;

function isStandalone(){return window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone===true}
function ensureInstallUI(){
  if(isStandalone() || document.getElementById('pwaInstallBanner')) return;
  const banner=document.createElement('div');
  banner.id='pwaInstallBanner';
  Object.assign(banner.style,{position:'fixed',top:'12px',left:'12px',right:'12px',zIndex:'9999',background:'#161b22',border:'1px solid #30363d',borderRadius:'18px',padding:'12px',boxShadow:'0 8px 30px rgba(0,0,0,.35)',display:'none',alignItems:'center',gap:'12px'});
  banner.innerHTML=`<img src="./icon-192.png" alt="Food Tracker" style="width:48px;height:48px;border-radius:12px"><div style="flex:1;min-width:0"><div style="font-weight:800;color:#f5f7fa">Install Food Tracker</div><div style="font-size:12px;color:#8b949e">Get the full app icon and standalone app experience.</div></div><button id="pwaInstallBtn" style="background:#39d98a;color:#07120c;border:0;border-radius:12px;padding:10px 14px;font-weight:800">Install</button><button id="pwaInstallClose" aria-label="Close" style="background:transparent;color:#8b949e;border:0;font-size:20px;padding:6px">×</button>`;
  document.body.appendChild(banner);
  document.getElementById('pwaInstallClose').onclick=()=>banner.style.display='none';
  document.getElementById('pwaInstallBtn').onclick=async()=>{
    if(!deferredPrompt) return;
    deferredPrompt.prompt();
    try{await deferredPrompt.userChoice}catch{}
    deferredPrompt=null;
    banner.style.display='none';
  };
}

window.addEventListener('beforeinstallprompt',e=>{
  e.preventDefault();
  deferredPrompt=e;
  ensureInstallUI();
  const banner=document.getElementById('pwaInstallBanner');
  if(banner) banner.style.display='flex';
});

window.addEventListener('appinstalled',()=>{
  deferredPrompt=null;
  const banner=document.getElementById('pwaInstallBanner');
  if(banner) banner.remove();
});

if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',ensureInstallUI);else ensureInstallUI();
})();