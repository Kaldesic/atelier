const CACHE_NAME = 'atelier-v19';

// Core essential assets for precaching
const PRECACHE_ASSETS = [
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
  './js/tools/webp-converter.js',
  './js/tools/json-formatter.js',
  './js/tools/url-encoder.js',
  './js/tools/color-converter.js',
  './js/tools/html-entity-encoder.js',
  './js/tools/box-shadow-generator.js',
  './js/tools/markdown-previewer.js',
  './js/tools/uuid-generator.js',
  './js/tools/regex-tester.js',
  './js/tools/gradient-generator.js',
  './js/tools/jwt-decoder.js',
  './js/tools/lorem-generator.js',
  './js/tools/qr-code-studio.js',
  './js/tools/text-diff-case.js',
  './js/tools/image-to-pdf.js',
  './js/tools/batch-processor.js'
];

// 1. Installation - Resilient precaching with individual error handling
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.all(
        PRECACHE_ASSETS.map((asset) =>
          cache.add(asset).catch((err) => {
            console.warn(`[SW] Precache failed for asset: ${asset}`, err);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// 2. Activation - Purge legacy caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch - Robust Cache-First strategy with dynamic caching & offline fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Only handle GET requests and valid HTTP/HTTPS schemes
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (!url.protocol.startsWith('http')) return;

  event.respondWith(
    (async () => {
      // Try finding response in Cache (ignoring search queries if needed)
      const cachedResponse = await caches.match(request, { ignoreSearch: false });
      if (cachedResponse) {
        return cachedResponse;
      }

      // Fetch from Network and dynamically cache valid responses
      try {
        const networkResponse = await fetch(request);

        if (
          networkResponse &&
          networkResponse.status === 200 &&
          (networkResponse.type === 'basic' || networkResponse.type === 'cors')
        ) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }

        return networkResponse;
      } catch (error) {
        // Fallback for HTML navigation requests when offline
        if (request.mode === 'navigate') {
          const fallbackResponse = await caches.match('./index.html') || await caches.match('./');
          if (fallbackResponse) return fallbackResponse;
        }

        return new Response('Network error occurred and no offline cache is available.', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({ 'Content-Type': 'text/plain' })
        });
      }
    })()
  );
});
