const CACHE='food-tracker-v25';
const ASSETS=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./install.js','./photo-smart.js','./food-db.js'];

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
    return new Response(await fresh.text(),{status:fresh.status,statusText:fresh.statusText,headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}});
  }catch{
    const cached=await caches.match('./index.html');
    return cached || new Response('Offline',{status:503});
  }
}

async function networkFirst(request){
  try{return await fetch(request,{cache:'no-store'});}catch{return (await caches.match(request)) || new Response('',{status:504});}
}

self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET') return;
  const url=new URL(event.request.url);
  if(event.request.mode==='navigate' || url.pathname.endsWith('/index.html') || url.pathname.endsWith('/food_tracker/')){
    event.respondWith(appResponse(event.request));
    return;
  }
  if(url.pathname.endsWith('/barcode.js') || url.pathname.endsWith('/install.js') || url.pathname.endsWith('/photo-smart.js') || url.pathname.endsWith('/food-db.js')){
    event.respondWith(networkFirst(event.request));
    return;
  }
  event.respondWith(caches.match(event.request).then(cached=>cached||fetch(event.request).then(resp=>{
    const copy=resp.clone();
    caches.open(CACHE).then(cache=>cache.put(event.request,copy));
    return resp;
  })));
});