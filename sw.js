const CACHE_NAME = 'plantmaster-v24'; // Zvýšená verze vynutí aktualizaci v mobilu
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js',
  'https://cdn-icons-png.flaticon.com/512/628/628283.png'
];

self.addEventListener('install', (e) => {
  self.skipWaiting(); // Vynutí okamžitou instalaci
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        // Smaže všechny staré verze aplikace v telefonu
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    })
  );
  self.clients.claim();
});

// VYLEPŠENÍ: Nejdřív stahuje z internetu novou verzi, až při chybě použije cache
self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('generativelanguage.googleapis.com')) return;

  e.respondWith(
    fetch(e.request).catch(() => {
      return caches.match(e.request).then((response) => {
        return response || new Response('Aplikace je offline.');
      });
    })
  );
});
