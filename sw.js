const CACHE_NAME = 'atelier-v19';

// Base path resolution for GitHub Pages deployment (/atelier/) vs root domain
const BASE_PATH = self.location.pathname.includes('/atelier/') ? '/atelier' : '';

const ASSETS_TO_CACHE = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/favicon.svg`,
  `${BASE_PATH}/css/main.css`,
  `${BASE_PATH}/js/core.js`,
  `${BASE_PATH}/js/registry.js`,
  `${BASE_PATH}/js/app.js`,
  `${BASE_PATH}/js/workers/image-worker.js`,
  `${BASE_PATH}/js/tools/aspect-ratio-calculator.js`,
  `${BASE_PATH}/js/tools/base64-converter.js`,
  `${BASE_PATH}/js/tools/color-extractor.js`,
  `${BASE_PATH}/js/tools/exif-stripper.js`,
  `${BASE_PATH}/js/tools/favicon-generator.js`,
  `${BASE_PATH}/js/tools/image-compressor.js`,
  `${BASE_PATH}/js/tools/image-resizer.js`,
  `${BASE_PATH}/js/tools/svg-cleaner.js`,
  `${BASE_PATH}/js/tools/svg-converter.js`,
  `${BASE_PATH}/js/tools/unit-converter.js`,
  `${BASE_PATH}/js/tools/webp-converter.js`,
  `${BASE_PATH}/js/tools/json-formatter.js`,
  `${BASE_PATH}/js/tools/url-encoder.js`,
  `${BASE_PATH}/js/tools/color-converter.js`,
  `${BASE_PATH}/js/tools/html-entity-encoder.js`,
  `${BASE_PATH}/js/tools/box-shadow-generator.js`,
  `${BASE_PATH}/js/tools/markdown-previewer.js`,
  `${BASE_PATH}/js/tools/uuid-generator.js`,
  `${BASE_PATH}/js/tools/regex-tester.js`,
  `${BASE_PATH}/js/tools/gradient-generator.js`,
  `${BASE_PATH}/js/tools/jwt-decoder.js`,
  `${BASE_PATH}/js/tools/lorem-generator.js`,
  `${BASE_PATH}/js/tools/qr-code-studio.js`,
  `${BASE_PATH}/js/tools/text-diff-case.js`,
  `${BASE_PATH}/js/tools/image-to-pdf.js`,
  `${BASE_PATH}/js/tools/batch-processor.js`
];

// 1. Installation - Resilient caching loop (prevents single 404 from failing SW install)
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

// 3. Fetch - Cache First with scheme guard, CORS support, and offline navigation fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // Handle GET requests only
  if (request.method !== 'GET') return;

  // Guard against browser extensions and non-http schemes
  const url = new URL(request.url);
  if (!url.protocol.startsWith('http')) return;

  event.respondWith(
    (async () => {
      // 1. Check cache first
      const cachedResponse = await caches.match(request);
      if (cachedResponse) {
        return cachedResponse;
      }

      // 2. Fall back to network
      try {
        const networkResponse = await fetch(request);

        // Cache valid basic or CORS responses
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
        // 3. SPA Navigation fallback when completely offline
        if (request.mode === 'navigate') {
          const offlineFallback = await caches.match(`${BASE_PATH}/index.html`) || await caches.match(`${BASE_PATH}/`);
          if (offlineFallback) return offlineFallback;
        }

        return new Response('Offline resource unavailable.', {
          status: 503,
          statusText: 'Service Unavailable',
          headers: new Headers({ 'Content-Type': 'text/plain' })
        });
      }
    })()
  );
});
