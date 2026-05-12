// Month Spread — service worker
// Caches the app shell so the page opens instantly and works offline (the
// spreadsheet data itself still needs network + a fresh OAuth token to fetch).

const CACHE = 'ms-shell-v1';
const SHELL = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(SHELL)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Never cache Google API calls or the GIS script — they need to be fresh.
  if (
    url.host.endsWith('googleapis.com') ||
    url.host.endsWith('google.com') ||
    url.host.endsWith('gstatic.com')
  ) {
    return; // let the browser handle it
  }

  // App-shell: cache-first, fall through to network, opportunistically update.
  if (req.method === 'GET' && url.origin === self.location.origin) {
    event.respondWith(
      caches.match(req).then((cached) => {
        const fetchPromise = fetch(req)
          .then((res) => {
            if (res && res.ok) {
              const copy = res.clone();
              caches.open(CACHE).then((cache) => cache.put(req, copy));
            }
            return res;
          })
          .catch(() => cached); // offline fallback
        return cached || fetchPromise;
      })
    );
  }
});
