<div align="center">

  <img src="favicon.svg" alt="Atelier Logo" width="96" height="96" />

  # Atelier

  **A curated digital workshop for minimalist web tools and utilities.**

  A hyper-optimized, zero-bloat Single-Page Application (SPA) built for developers and designers who need essential utilities — without compromising on privacy or performance.

  [![100% Client-Side](https://img.shields.io/badge/processing-100%25%20client--side-brightgreen)](#)
  [![Zero Telemetry](https://img.shields.io/badge/telemetry-zero-blue)](#)
  [![PWA Ready](https://img.shields.io/badge/PWA-offline%20ready-orange)](#)
  [![License: GPL-3.0](https://img.shields.io/badge/license-GPL--3.0-blueviolet)](#)

</div>

---

Every tool in Atelier runs **100% locally, in your browser's RAM**. No data is ever sent to a server, nothing is tracked, no cookies are stored.

> 🔒 **Privacy by design.** Open the page, use the tool, close the tab — as if nothing ever happened.

---

## 🚀 Architectural Philosophy

Atelier was rebuilt from the ground up with a focus on maximum performance and privacy:

| Principle | Details |
|---|---|
| ⚡ **Zero-Network Execution** | All processing (from Base64 decoding to 8K image resizing) happens locally via Web Workers and Web APIs. |
| 🧩 **Fully Dynamic SPA Engine** | Tools are lazy-loaded through ES modules (`js/tools/*.js`) — adding a new tool requires zero HTML boilerplate. |
| 🧵 **Off-Main-Thread Processing** | Heavy Canvas operations are offloaded to an `OffscreenCanvas` Web Worker (`js/workers/image-worker.js`), keeping the UI perfectly smooth. |
| 📦 **Aggressive PWA Caching** | A cache-first Service Worker (`sw.js`) enables 100% offline use and instant loading (0ms latency) after the first visit. |
| 🛡️ **Hermetic Security** | Strict `Content-Security-Policy` and `Permissions-Policy` headers. |
| 🧠 **Global Memory Safety** | A centralized URL lifecycle manager automatically tracks and revokes `Blob` object URLs, preventing memory leaks during route transitions. |

---

## 🧰 Full Tool Suite

Atelier includes **28 tools** organized into **5 thematic domains**.

### 🖼️ 1. Image & Media Studio
- **Batch Image & File Processor** — bulk convert, resize, rename, and package images into a ZIP file.
- **Image Compressor** — reduce image file size with configurable quality and a live size comparison.
- **WebP Converter** — convert JPG, PNG, and GIF images to modern WebP format instantly.
- **Image Resizer** — resize images with custom dimensions and optional aspect-ratio locking.
- **Favicon Package Generator** — generate multi-resolution icons (16px–512px) with ready-to-use HTML code.
- **EXIF Metadata Stripper** — remove sensitive geolocation and camera metadata from photos.
- **Color Palette Extractor** — extract dominant colors and hex codes from uploaded images.

### 🎨 2. Vector & Design Engineering
- **Color Palette & Token Exporter** — generate 10-step accessible shade scales (50–950), run WCAG contrast checks, export to Tailwind, CSS, SCSS, or DTCG JSON.
- **SVG Cleaner & Optimizer** — minify SVG files by removing editor clutter and unused tags.
- **SVG Rasterizer** — convert vector SVG files into high-resolution PNG or JPEG images.
- **CSS Gradient & Mesh Generator** — design linear, radial, and conic gradients with a live preview.
- **CSS Box Shadow & Glass Generator** — design layered shadows and glassmorphic cards with copyable CSS/Tailwind export.
- **Color & Contrast Matrix** — convert between HEX, RGB, and HSL values and test WCAG contrast ratios.

### 📄 3. Documents & Daily Utilities
- **Smart QR Code Studio** — generate high-resolution QR codes for WiFi, vCard contacts, URLs, and plain text.
- **Text Diff & Case Converter** — compare text side-by-side and convert between camelCase, kebab-case, and snake_case.
- **Image to PDF Packager** — combine multiple JPG, PNG, and WebP images into a single PDF document.

### 📐 4. Layout & Typography
- **PX / REM & Fluid Type Engine** — convert CSS units and generate fluid typography `clamp()` formulas.
- **Aspect Ratio Calculator** — calculate proportional dimensions for responsive video and grid layouts.
- **Markdown Live Previewer** — write GFM Markdown with live preview, word stats, and HTML export.

### 🔐 5. Developer & Security Tools
- **SQL Formatter & Validator** — format, beautify, validate, and minify SQL queries (Postgres, MySQL, SQLite, ANSI).
- **JWT Secret & Key Generator** — generate cryptographically secure secrets (HS256/512), RSA/ECDSA key pairs, and API tokens via the Web Crypto API.
- **JWT Debugger & Inspector** — decode header and payload claims of JSON Web Tokens client-side, with expiration checks.
- **JSON Formatter & Validator** — format, validate, minify, and syntax-highlight JSON data.
- **Base64 Encoder / Decoder** — convert files to Base64 data URLs and decode strings back into files.
- **UUID & Secret Token Generator** — generate RFC4122 UUID v4s, NanoIDs, cryptographic hashes, and passphrases.
- **Regex Tester & Analyzer** — test JavaScript regex patterns with match highlighting, capture groups, and substitution.
- **URL Encoder & Query Parser** — encode/decode URLs and parse complex query parameters.
- **HTML Entity Encoder** — escape, unescape, and sanitize HTML entities and special characters.
- **Lorem & Mock Data Generator** — generate placeholder text, sentences, dummy user records, and product JSON datasets.

---

## 🛡️ License & Privacy

<div align="center">

**100% Client-Side Processing** · **No Analytics** · **Zero Telemetry** · **GPL-3.0 License**

Built with precision for web developers & designers. ✨

</div>
