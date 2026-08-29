const CACHE_NAME = 'atelier-v21';

// Base path resolution for GitHub Pages deployment (/atelier/) vs root domain
const BASE_PATH = self.location.pathname.includes('/atelier/') ? '/atelier' : '';

const ASSETS_TO_CACHE = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/favicon.png`,
  `${BASE_PATH}/favicon.svg`,
  `${BASE_PATH}/css/main.css`,
  `${BASE_PATH}/js/core.js`,
  `${BASE_PATH}/js/registry.js`,
  `${BASE_PATH}/js/app.js`,
  `${BASE_PATH}/js/workers/image-worker.js`,
  `${BASE_PATH}/js/tools/aspect-ratio-calculator.js`,
  `${BASE_PATH}/js/tools/base64-converter.js`,
  `${BASE_PATH}/js/tools/batch-processor.js`,
  `${BASE_PATH}/js/tools/box-shadow-generator.js`,
  `${BASE_PATH}/js/tools/color-converter.js`,
  `${BASE_PATH}/js/tools/color-extractor.js`,
  `${BASE_PATH}/js/tools/exif-stripper.js`,
  `${BASE_PATH}/js/tools/favicon-generator.js`,
  `${BASE_PATH}/js/tools/gradient-generator.js`,
  `${BASE_PATH}/js/tools/html-entity-encoder.js`,
  `${BASE_PATH}/js/tools/image-compressor.js`,
  `${BASE_PATH}/js/tools/image-resizer.js`,
  `${BASE_PATH}/js/tools/image-to-pdf.js`,
  `${BASE_PATH}/js/tools/json-formatter.js`,
  `${BASE_PATH}/js/tools/jwt-decoder.js`,
  `${BASE_PATH}/js/tools/jwt-secret-generator.js`,
  `${BASE_PATH}/js/tools/lorem-generator.js`,
  `${BASE_PATH}/js/tools/markdown-previewer.js`,
  `${BASE_PATH}/js/tools/palette-exporter.js`,
  `${BASE_PATH}/js/tools/qr-code-studio.js`,
  `${BASE_PATH}/js/tools/regex-tester.js`,
  `${BASE_PATH}/js/tools/sql-formatter.js`,
  `${BASE_PATH}/js/tools/svg-cleaner.js`,
  `${BASE_PATH}/js/tools/svg-converter.js`,
  `${BASE_PATH}/js/tools/text-diff-case.js`,
  `${BASE_PATH}/js/tools/unit-converter.js`,
  `${BASE_PATH}/js/tools/url-encoder.js`,
  `${BASE_PATH}/js/tools/uuid-generator.js`,
  `${BASE_PATH}/js/tools/webp-converter.js`
];

// 1. Installation - Resilient caching loop
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.all(
        ASSETS_TO_CACHE.map((asset) =>
          cache.add(asset).catch((err) => {
            console.warn(`[Atelier SW] Pre-cache failed for: ${asset}`, err);
          })
        )
      );
    }).then(() => self.skipWaiting())
  );
});

// 2. Activation - Purge old caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      );
    }).then(() => self.clients.claim())
  );
});

// 3. Fetch - Cache First with Stale-While-Revalidate Navigation Fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;

  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (!url.protocol.startsWith('http')) return;

  // Optimized Navigation Handler
  if (request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        const cachedHTML = 
          (await caches.match(request)) ||
          (await caches.match(`${BASE_PATH}/index.html`)) ||
          (await caches.match(`${BASE_PATH}/`));

        // Fetch fresh copy in background to keep cache synced
        const fetchPromise = fetch(request).then(async (networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => null);

        // Return cached HTML immediately if present
        return cachedHTML || (await fetchPromise) || new Response('Offline resource unavailable.', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({ 'Content-Type': 'text/plain' })
        });
      })()
    );
    return;
  }

  // General Static Assets Handler
  event.respondWith(
    (async () => {
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }

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
        return new Response('Offline resource unavailable.', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({ 'Content-Type': 'text/plain' })
        });
      }
    })()
  );
});
