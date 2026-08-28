/* js/registry.js */
export const TOOLS_REGISTRY = [
  // --- 1. Image & Media Studio ---
  {
    id: 'image-compressor',
    title: 'Image Compressor',
    description: 'Reduce image file size with configurable quality and size comparison.',
    path: 'image-compressor',
    category: 'Image & Media Studio'
  },
  {
    id: 'webp-converter',
    title: 'WebP Converter',
    description: 'Convert JPG, PNG, and GIF images to modern WebP format instantly.',
    path: 'webp-converter',
    category: 'Image & Media Studio'
  },
  {
    id: 'image-resizer',
    title: 'Image Resizer',
    description: 'Resize images with custom dimensions and aspect ratio locking.',
    path: 'image-resizer',
    category: 'Image & Media Studio'
  },
  {
    id: 'favicon-generator',
    title: 'Favicon Package Generator',
    description: 'Generate multi-resolution icons (16px to 512px) with HTML snippet.',
    path: 'favicon-generator',
    category: 'Image & Media Studio'
  },
  {
    id: 'exif-stripper',
    title: 'EXIF Metadata Stripper',
    description: 'Remove sensitive geolocation and camera telemetry from photos.',
    path: 'exif-stripper',
    category: 'Image & Media Studio'
  },
  {
    id: 'color-extractor',
    title: 'Color Palette Extractor',
    description: 'Extract dominant color palettes and hex codes from uploaded images.',
    path: 'color-extractor',
    category: 'Image & Media Studio'
  },

  // --- 2. Vector & Design Engineering ---
  {
    id: 'svg-cleaner',
    title: 'SVG Cleaner & Optimizer',
    description: 'Minify SVGs by removing editor clutter, comments, and unused tags.',
    path: 'svg-cleaner',
    category: 'Vector & Design Engineering'
  },
  {
    id: 'svg-converter',
    title: 'SVG Rasterizer',
    description: 'Convert vector SVG files to high-res PNG or JPEG images.',
    path: 'svg-converter',
    category: 'Vector & Design Engineering'
  },
  {
    id: 'gradient-generator',
    title: 'CSS Gradient & Mesh Generator',
    description: 'Design linear, radial, and conic gradients with live preview and CSS export.',
    path: 'gradient-generator',
    category: 'Vector & Design Engineering'
  },
  {
    id: 'box-shadow-generator',
    title: 'CSS Box Shadow & Glass Generator',
    description: 'Design layered shadows and glassmorphic cards with copyable CSS & Tailwind.',
    path: 'box-shadow-generator',
    category: 'Vector & Design Engineering'
  },
  {
    id: 'color-converter',
    title: 'Color & Contrast Matrix',
    description: 'Convert HEX, RGB, HSL values and test WCAG accessibility contrast ratios.',
    path: 'color-converter',
    category: 'Vector & Design Engineering'
  },

  // --- 3. Documents & Daily Utilities ---
  {
    id: 'qr-code-studio',
    title: 'Smart QR Code Studio',
    description: 'Generate high-res QR codes for WiFi, vCard contacts, URLs, and plain text.',
    path: 'qr-code-studio',
    category: 'Documents & Daily Utilities'
  },
  {
    id: 'text-diff-case',
    title: 'Text Diff & Case Converter',
    description: 'Compare text diffs side-by-side and transform camelCase, kebab, and snake casing.',
    path: 'text-diff-case',
    category: 'Documents & Daily Utilities'
  },
  {
    id: 'image-to-pdf',
    title: 'Image to PDF Packager',
    description: 'Combine multiple JPG, PNG, and WebP images into a single PDF document.',
    path: 'image-to-pdf',
    category: 'Documents & Daily Utilities'
  },

  // --- 4. Layout & Typography ---
  {
    id: 'unit-converter',
    title: 'PX / REM & Fluid Type Engine',
    description: 'Convert CSS units and generate fluid typography clamp formulas.',
    path: 'unit-converter',
    category: 'Layout & Typography'
  },
  {
    id: 'aspect-ratio-calculator',
    title: 'Aspect Ratio Calculator',
    description: 'Calculate proportional dimensions for responsive video and grid layouts.',
    path: 'aspect-ratio-calculator',
    category: 'Layout & Typography'
  },
  {
    id: 'markdown-previewer',
    title: 'Markdown Live Previewer',
    description: 'Write GFM Markdown with live visual preview, word stats, and HTML export.',
    path: 'markdown-previewer',
    category: 'Layout & Typography'
  },

  // --- 5. Developer & Security Tools ---
  {
    id: 'json-formatter',
    title: 'JSON Formatter & Validator',
    description: 'Format, validate, minfy, and syntax-highlight JSON data.',
    path: 'json-formatter',
    category: 'Developer & Security Tools'
  },
  {
    id: 'base64-converter',
    title: 'Base64 Encoder / Decoder',
    description: 'Convert files to Base64 Data URLs and decode strings back to files.',
    path: 'base64-converter',
    category: 'Developer & Security Tools'
  },
  {
    id: 'jwt-decoder',
    title: 'JWT Debugger & Inspector',
    description: 'Decode header and payload claims of JSON Web Tokens client-side with expiration checks.',
    path: 'jwt-decoder',
    category: 'Developer & Security Tools'
  },
  {
    id: 'uuid-generator',
    title: 'UUID & Secret Token Generator',
    description: 'Generate RFC4122 UUID v4, NanoID, cryptographic hashes, and passphrases.',
    path: 'uuid-generator',
    category: 'Developer & Security Tools'
  },
  {
    id: 'regex-tester',
    title: 'Regex Tester & Analyzer',
    description: 'Test JavaScript regex patterns with match highlights, capture groups, and substitution.',
    path: 'regex-tester',
    category: 'Developer & Security Tools'
  },
  {
    id: 'url-encoder',
    title: 'URL Encoder & Query Parser',
    description: 'Encode, decode URLs, and parse complex query parameters.',
    path: 'url-encoder',
    category: 'Developer & Security Tools'
  },
  {
    id: 'html-entity-encoder',
    title: 'HTML Entity Encoder',
    description: 'Escape, unescape, and sanitize HTML entities and special characters.',
    path: 'html-entity-encoder',
    category: 'Developer & Security Tools'
  },
  {
    id: 'lorem-generator',
    title: 'Lorem & Mock Data Generator',
    description: 'Generate placeholder text, sentences, dummy user records, and product JSON datasets.',
    path: 'lorem-generator',
    category: 'Developer & Security Tools'
  }
];
