/* MG Candy Blast offline cache (works when hosted over HTTPS or localhost) */
const CACHE='mgcb-v12';
const FILES=['./','index.html','style.css','storage.js','engine.js','level-tuning.js','levels.js','audio.js','effects.js','art.js','game.js','ui.js','manifest.json','assets/icons/icon.svg','assets/icons/icon-192.png','assets/icons/icon-512.png','assets/images/logo.svg','assets/images/home.jpg'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(res=>{
    if(res&&res.status===200&&(res.type==='basic'||res.type==='cors')){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}return res;
  }).catch(()=>caches.match('index.html'))));
});
