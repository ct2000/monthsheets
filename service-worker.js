const CACHE = 'ms-search-month-ui-fix-20260512-194154';
const SHELL=['./','./index.html','./manifest.json','./icon-192.png','./icon-512.png','./icon-512-maskable.png','./apple-touch-icon.png','./favicon.png'];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{const req=e.request,url=new URL(req.url);if(url.host.endsWith('googleapis.com')||url.host.endsWith('google.com')||url.host.endsWith('gstatic.com'))return;if(req.method==='GET'&&url.origin===self.location.origin)e.respondWith(fetch(req,{cache:'no-store'}).then(res=>{if(res&&res.ok)caches.open(CACHE).then(c=>c.put(req,res.clone()));return res}).catch(()=>caches.match(req)))});
