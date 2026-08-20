# Atelier 🛠️

**A curated digital workshop for minimalist web tools and utilities.**

Atelier is a hyper-optimized, zero-bloat Single-Page Application (SPA) designed to provide developers and designers with essential utilities without compromising privacy or performance. 

Every tool in Atelier runs **100% locally in your browser's RAM**. No data is ever sent to a server, no analytics are tracked, and no cookies are stored. 

## 🚀 Architectural Philosophy

Atelier was rebuilt from the ground up to achieve maximum performance and privacy:

- **Zero-Network Execution**: All processing (from Base64 decoding to 8K image resizing) happens locally via Web Workers and Web APIs. 
- **Fully Dynamic SPA Engine**: Tools are lazy-loaded via ES modules (`js/tools/*.js`). Adding a new tool requires zero HTML boilerplate.
- **Off-Main-Thread Processing**: Intensive Canvas operations are offloaded to an `OffscreenCanvas` Web Worker (`js/workers/image-worker.js`), ensuring the UI remains silky smooth at all times.
- **Aggressive PWA Caching**: Driven by a cache-first Service Worker (`sw.js`), the entire suite is 100% usable offline and loads instantly (0ms latency) after the first visit.
- **Hermetic Security**: Secured with strict `Content-Security-Policy` and `Permissions-Policy` headers.
- **Global Memory Safety**: A centralized URL lifecycle manager automatically tracks and revokes `Blob` Object URLs to prevent browser memory leaks during route transitions.

## 🧰 The Suite

Atelier includes an ever-expanding suite of utilities, dynamically categorized and equipped with a live search engine:

### Media & Images
- **WebP Converter**: Convert JPG/PNG/GIF to optimized WebP formats instantly.
- **Image Compressor**: Reduce file size with visual quality sliders.
- **Image Resizer**: Resize images with custom dimensions and aspect-ratio locking.
- **Color Palette Extractor**: Extract dominant colors and HEX/RGB codes from images.
- **EXIF Metadata Stripper**: Remove sensitive geolocation and camera data from personal photos.

### Developer Utilities
- **Base64 Encoder / Decoder**: Convert files to Data URLs and decode strings back to binary files.
- **SVG Cleaner**: Optimize SVGs by stripping metadata, comments, and inline clutter.
- **SVG Rasterizer**: Convert vector SVGs to high-res PNG/WebP images with scale multipliers.
- **Favicon Generator**: Generate standard multi-size PNG favicons and HTML head tags via ZIP download.

### Typography & Layout
- **PX / REM & Fluid Type Engine**: Convert CSS units and generate fluid typography `clamp()` formulas.
- **Aspect Ratio Calculator**: Calculate proportional dimensions for responsive layouts.

## 🛡️ License & Privacy
100% Client-side processing • No analytics • Zero Telemetry
Built with precision for web developers & designers.
