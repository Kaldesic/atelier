const CACHE_NAME = 'atelier-v7';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './favicon.svg',
  './css/main.css',
  './js/core.js',
  './js/registry.js',
  
  './js/app.js',
  './js/workers/image-worker.js',
  './js/tools/aspect-ratio-calculator.js',
  './js/tools/base64-converter.js',
  './js/tools/color-extractor.js',
  './js/tools/exif-stripper.js',
  './js/tools/favicon-generator.js',
  './js/tools/image-compressor.js',
  './js/tools/image-resizer.js',
  './js/tools/svg-cleaner.js',
  './js/tools/svg-converter.js',
  './js/tools/unit-converter.js',
  './js/tools/webp-converter.js'
];

// 1. Instalacija - keširanje osnovnih resursa i skripti
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        }).then(() => self.skipWaiting())
    );
});

// 2. Aktiviranje - čišćenje starih verzija keša
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
            );
        }).then(() => self.clients.claim())
    );
});

// 3. Strategija: Cache First, sa automatskim keširanjem novih zahteva u hodu
self.addEventListener('fetch', (event) => {
    if (event.request.method !== 'GET') return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                return cachedResponse;
            }
            return fetch(event.request).then((response) => {
                if (!response || response.status !== 200 || response.type !== 'basic') {
                    return response;
                }
                const responseToCache = response.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });
                return response;
            }).catch(() => {
                // Offline fallback opcija ako zatreba
            });
        })
    );
});
