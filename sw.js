const CACHE='food-tracker-v4';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon.svg','./barcode.js'];

self.addEventListener('install',event=>{
  self.skipWaiting();
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(ASSETS)));
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

async function appResponse(request){
  try{
    const fresh=await fetch(request,{cache:'no-store'});
    let html=await fresh.text();
    if(!html.includes('barcode.js')) html=html.replace('</body>','<script src="./barcode.js?v=4"></script></body>');
    return new Response(html,{status:fresh.status,statusText:fresh.statusText,headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}});
  }catch{
    const cached=await caches.match('./index.html');
    if(!cached) return new Response('Offline',{status:503});
    let html=await cached.text();
    if(!html.includes('barcode.js')) html=html.replace('</body>','<script src="./barcode.js?v=4"></script></body>');
    return new Response(html,{headers:{'content-type':'text/html; charset=utf-8'}});
  }
}

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(event.request.mode==='navigate' || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/food_tracker/')){
    event.respondWith(appResponse(event.request));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(resp=>{
    const copy=resp.clone();
    caches.open(CACHE).then(cache=>cache.put(event.request,copy));
    return resp;
  })));
});