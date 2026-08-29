/* js/tools/palette-exporter.js - Color Palette & Design Token Exporter */

export const html = `
<div class="tool-section" id="palette-exporter-tool">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <div>
            <h1 class="tool-section-title" style="margin-bottom: 0.25rem;">Color Palette & Design Tokens Exporter</h1>
            <p style="color: var(--text-muted); font-size: 0.85rem;">Generate 10-step accessible shade scales (50-950), test WCAG contrast, and export to Tailwind, CSS, SCSS, or DTCG JSON.</p>
        </div>
    </div>

    <!-- Presets Bar -->
    <div class="presets-bar" style="margin-bottom: 1.25rem;">
        <span style="font-size: 0.8rem; color: var(--text-muted); align-self: center;">Preset Tones:</span>
        <button class="preset-btn active" data-hex="#3b82f6" id="pal-preset-blue">Indigo Blue</button>
        <button class="preset-btn" data-hex="#10b981" id="pal-preset-emerald">Emerald</button>
        <button class="preset-btn" data-hex="#8b5cf6" id="pal-preset-violet">Violet</button>
        <button class="preset-btn" data-hex="#f43f5e" id="pal-preset-rose">Rose</button>
        <button class="preset-btn" data-hex="#f59e0b" id="pal-preset-amber">Amber</button>
        <button class="preset-btn" data-hex="#06b6d4" id="pal-preset-cyan">Cyan</button>
    </div>

    <!-- Base Configuration Controls -->
    <div class="controls-grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.5rem; background: var(--bg); padding: 1rem; border-radius: 8px; border: 1px solid var(--border);">
        <div class="input-group" style="margin-bottom: 0;">
            <label class="input-label" for="pal-base-color">Primary Seed Color</label>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
                <input type="color" id="pal-color-picker" value="#3b82f6" style="width: 42px; height: 38px; padding: 2px; border: 1px solid var(--border); border-radius: 6px; cursor: pointer; background: transparent;">
                <input type="text" id="pal-base-color" class="input-field" value="#3b82f6" style="font-family: var(--font-mono); text-transform: uppercase;">
            </div>
        </div>
        <div class="input-group" style="margin-bottom: 0;">
            <label class="input-label" for="pal-token-name">Token Prefix Name</label>
            <input type="text" id="pal-token-name" class="input-field" value="primary" placeholder="e.g. brand, primary, accent">
        </div>
        <div class="input-group" style="margin-bottom: 0;">
            <label class="input-label" for="pal-harmony">Color Harmony</label>
            <select id="pal-harmony" class="select-field">
                <option value="monochrome" selected>Monochromatic (10 Shades)</option>
                <option value="complementary">Complementary (+ Opposite)</option>
                <option value="analogous">Analogous (+ Adjacent)</option>
                <option value="triadic">Triadic (3 Harmonious)</option>
            </select>
        </div>
    </div>

    <!-- 10-Shade Scale Swatches Grid -->
    <div style="margin-bottom: 1.5rem;">
        <h2 style="font-size: 0.95rem; font-weight: 600; margin-bottom: 0.75rem; color: var(--text);">Generated 10-Step Shade Palette (50 – 950)</h2>
        <div id="pal-swatches-container" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(80px, 1fr)); gap: 0.5rem;">
            <!-- Swatches injected via JS -->
        </div>
    </div>

    <!-- Live Component Preview & WCAG Contrast Matrix -->
    <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 1.25rem; margin-bottom: 1.5rem;" id="pal-preview-grid">
        <!-- Live UI Components -->
        <div style="background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem;">
            <h3 style="font-size: 0.85rem; font-weight: 600; margin-bottom: 1rem; color: var(--text-muted);">Interactive UI Component Preview</h3>
            
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <!-- Buttons Preview -->
                <div style="display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center;">
                    <button id="ui-btn-primary" class="btn" style="background: #3b82f6; color: #ffffff; border: none; font-weight: 600; padding: 0.5rem 1rem; border-radius: 6px;">Primary Button</button>
                    <button id="ui-btn-light" class="btn" style="background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; font-weight: 600; padding: 0.5rem 1rem; border-radius: 6px;">Soft Tint</button>
                    <span id="ui-badge" style="background: #dbeafe; color: #1e40af; font-size: 0.75rem; padding: 3px 8px; border-radius: 12px; font-weight: 600;">Active Badge</span>
                </div>

                <!-- Alert Card Preview -->
                <div id="ui-card-preview" style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 0.85rem 1rem; color: #1e3a8a; font-size: 0.85rem;">
                    <div style="font-weight: 600; margin-bottom: 0.25rem;">Design Token System Active</div>
                    <div style="color: #1d4ed8; font-size: 0.8rem;">Every shade mathematically computed for optimal light/dark contrast and visual hierarchy.</div>
                </div>
            </div>
        </div>

        <!-- WCAG Matrix Summary -->
        <div style="background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem;">
            <h3 style="font-size: 0.85rem; font-weight: 600; margin-bottom: 1rem; color: var(--text-muted);">WCAG 2.1 Contrast Ratios</h3>
            <div style="font-size: 0.85rem; display: flex; flex-direction: column; gap: 0.5rem;">
                <div style="display: flex; justify-content: space-between;">
                    <span>Primary (500) vs Pure White (#FFF):</span>
                    <strong id="wcag-white-ratio">4.6:1 (AA)</strong>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>Primary (500) vs Dark (#0F172A):</span>
                    <strong id="wcag-dark-ratio">7.8:1 (AAA)</strong>
                </div>
                <div style="display: flex; justify-content: space-between;">
                    <span>Recommended Text on 500:</span>
                    <strong id="wcag-text-rec">White (#FFFFFF)</strong>
                </div>
            </div>
        </div>
    </div>

    <!-- Export Code Section -->
    <div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.75rem;">
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
                <button class="preset-btn active" id="pal-fmt-tw3">Tailwind v3 Config</button>
                <button class="preset-btn" id="pal-fmt-tw4">Tailwind v4 @theme</button>
                <button class="preset-btn" id="pal-fmt-css">CSS Variables</button>
                <button class="preset-btn" id="pal-fmt-scss">SCSS</button>
                <button class="preset-btn" id="pal-fmt-json">DTCG JSON</button>
            </div>
            <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-outline" id="pal-download-btn" style="padding: 0.3rem 0.6rem; font-size: 0.75rem;">Download</button>
                <button class="btn btn-primary" id="pal-copy-btn" style="padding: 0.3rem 0.8rem; font-size: 0.75rem;">Copy Code</button>
            </div>
        </div>

        <textarea id="pal-export-output" class="textarea-field" readonly style="height: 220px; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.45; background: var(--bg);"></textarea>
    </div>
</div>
`;

export function init() {
    const colorPicker = document.getElementById('pal-color-picker');
    const baseColorInput = document.getElementById('pal-base-color');
    const tokenNameInput = document.getElementById('pal-token-name');
    const harmonySelect = document.getElementById('pal-harmony');
    const swatchesContainer = document.getElementById('pal-swatches-container');
    const exportOutput = document.getElementById('pal-export-output');
    const copyBtn = document.getElementById('pal-copy-btn');
    const downloadBtn = document.getElementById('pal-download-btn');

    // UI elements
    const uiBtnPrimary = document.getElementById('ui-btn-primary');
    const uiBtnLight = document.getElementById('ui-btn-light');
    const uiBadge = document.getElementById('ui-badge');
    const uiCard = document.getElementById('ui-card-preview');

    const wcagWhiteRatio = document.getElementById('wcag-white-ratio');
    const wcagDarkRatio = document.getElementById('wcag-dark-ratio');
    const wcagTextRec = document.getElementById('wcag-text-rec');

    let currentFormat = 'tw3';

    // Color conversion helpers
    function hexToRgb(hex) {
        let clean = hex.replace('#', '');
        if (clean.length === 3) {
            clean = clean.split('').map(c => c + c).join('');
        }
        const num = parseInt(clean, 16);
        return {
            r: (num >> 16) & 255,
            g: (num >> 8) & 255,
            b: num & 255
        };
    }

    function rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = Math.max(0, Math.min(255, Math.round(x))).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    function rgbToHsl(r, g, b) {
        r /= 255; g /= 255; b /= 255;
        const max = Math.max(r, g, b), min = Math.min(r, g, b);
        let h, s, l = (max + min) / 2;

        if (max === min) {
            h = s = 0;
        } else {
            const d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r: h = (g - b) / d + (g < b ? 6 : 0); break;
                case g: h = (b - r) / d + 2; break;
                case b: h = (r - g) / d + 4; break;
            }
            h /= 6;
        }
        return { h: h * 360, s: s * 100, l: l * 100 };
    }

    function hslToRgb(h, s, l) {
        h /= 360; s /= 100; l /= 100;
        let r, g, b;

        if (s === 0) {
            r = g = b = l;
        } else {
            const hue2rgb = (p, q, t) => {
                if (t < 0) t += 1;
                if (t > 1) t -= 1;
                if (t < 1 / 6) return p + (q - p) * 6 * t;
                if (t < 1 / 2) return q;
                if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1 / 3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1 / 3);
        }
        return { r: r * 255, g: g * 255, b: b * 255 };
    }

    // Perceived luminance & WCAG contrast calculation
    function getLuminance(r, g, b) {
        const a = [r, g, b].map(v => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }

    function getContrast(rgb1, rgb2) {
        const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
        const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
        const brightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);
        return (brightest + 0.05) / (darkest + 0.05);
    }

    // Generate 10-step scale (50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950)
    function generateShadeScale(baseHex) {
        const rgb = hexToRgb(baseHex);
        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

        const stops = [
            { step: '50', l: 96, s: Math.min(hsl.s * 0.45, 100) },
            { step: '100', l: 91, s: Math.min(hsl.s * 0.65, 100) },
            { step: '200', l: 82, s: Math.min(hsl.s * 0.8, 100) },
            { step: '300', l: 71, s: Math.min(hsl.s * 0.9, 100) },
            { step: '400', l: 60, s: hsl.s },
            { step: '500', l: hsl.l, s: hsl.s },
            { step: '600', l: Math.max(hsl.l * 0.85, 28), s: Math.min(hsl.s * 1.05, 100) },
            { step: '700', l: Math.max(hsl.l * 0.7, 20), s: Math.min(hsl.s * 1.1, 100) },
            { step: '800', l: Math.max(hsl.l * 0.55, 14), s: Math.min(hsl.s * 1.15, 100) },
            { step: '900', l: Math.max(hsl.l * 0.4, 9), s: Math.min(hsl.s * 1.2, 100) },
            { step: '950', l: Math.max(hsl.l * 0.25, 5), s: Math.min(hsl.s * 1.25, 100) }
        ];

        return stops.map(stop => {
            if (stop.step === '500') {
                return { step: '500', hex: baseHex.toLowerCase(), rgb, hsl };
            }
            const sRgb = hslToRgb(hsl.h, stop.s, stop.l);
            const sHex = rgbToHex(sRgb.r, sRgb.g, sRgb.b);
            return {
                step: stop.step,
                hex: sHex.toLowerCase(),
                rgb: sRgb,
                hsl: { h: hsl.h, s: stop.s, l: stop.l }
            };
        });
    }

    function renderSwatches(shades) {
        swatchesContainer.innerHTML = shades.map(shade => {
            const isDark = shade.hsl.l < 55;
            const textColor = isDark ? '#ffffff' : '#0f172a';
            return `
                <div class="swatch-card" style="background: ${shade.hex}; color: ${textColor}; padding: 0.75rem 0.5rem; border-radius: 8px; text-align: center; border: 1px solid rgba(0,0,0,0.1); cursor: pointer; transition: transform 0.15s ease;" title="Click to copy ${shade.hex}" data-copy-hex="${shade.hex}">
                    <div style="font-size: 0.75rem; font-weight: 700; margin-bottom: 0.25rem;">${shade.step}</div>
                    <div style="font-family: var(--font-mono); font-size: 0.7rem;">${shade.hex}</div>
                </div>
            `;
        }).join('');

        swatchesContainer.querySelectorAll('.swatch-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const hex = e.currentTarget.getAttribute('data-copy-hex');
                Atelier.copyToClipboard(hex, `Copied ${hex}!`);
            });
        });
    }

    function updatePreviewAndContrast(shades) {
        const s50 = shades.find(s => s.step === '50')?.hex || '#eff6ff';
        const s100 = shades.find(s => s.step === '100')?.hex || '#dbeafe';
        const s200 = shades.find(s => s.step === '200')?.hex || '#bfdbfe';
        const s500 = shades.find(s => s.step === '500')?.hex || '#3b82f6';
        const s600 = shades.find(s => s.step === '600')?.hex || '#2563eb';
        const s700 = shades.find(s => s.step === '700')?.hex || '#1d4ed8';
        const s800 = shades.find(s => s.step === '800')?.hex || '#1e40af';
        const s900 = shades.find(s => s.step === '900')?.hex || '#1e3a8a';

        // Apply to UI components
        uiBtnPrimary.style.background = s500;
        uiBtnPrimary.style.color = '#ffffff';

        uiBtnLight.style.background = s50;
        uiBtnLight.style.color = s700;
        uiBtnLight.style.borderColor = s200;

        uiBadge.style.background = s100;
        uiBadge.style.color = s800;

        uiCard.style.background = s50;
        uiCard.style.borderColor = s200;
        uiCard.style.color = s900;

        // WCAG calculations for 500 shade
        const rgb500 = hexToRgb(s500);
        const whiteContrast = getContrast(rgb500, { r: 255, g: 255, b: 255 });
        const darkContrast = getContrast(rgb500, { r: 15, g: 23, b: 42 });

        const formatRatio = (r) => {
            const val = r.toFixed(1) + ':1';
            if (r >= 7) return `${val} (AAA Pass)`;
            if (r >= 4.5) return `${val} (AA Pass)`;
            return `${val} (Large text only)`;
        };

        wcagWhiteRatio.textContent = formatRatio(whiteContrast);
        wcagWhiteRatio.style.color = whiteContrast >= 4.5 ? 'var(--success)' : 'var(--warning)';

        wcagDarkRatio.textContent = formatRatio(darkContrast);
        wcagDarkRatio.style.color = darkContrast >= 4.5 ? 'var(--success)' : 'var(--warning)';

        wcagTextRec.textContent = whiteContrast >= darkContrast ? 'White (#FFFFFF)' : 'Dark (#0F172A)';
    }

    function generateExportCode(shades, tokenName, format) {
        if (format === 'tw3') {
            return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      colors: {\n        '${tokenName}': {\n${shades.map(s => `          ${s.step}: '${s.hex}',`).join('\n')}\n        }\n      }\n    }\n  }\n};`;
        }

        if (format === 'tw4') {
            return `/* Tailwind CSS v4 @theme */\n@theme {\n${shades.map(s => `  --color-${tokenName}-${s.step}: ${s.hex};`).join('\n')}\n}`;
        }

        if (format === 'css') {
            return `:root {\n${shades.map(s => `  --color-${tokenName}-${s.step}: ${s.hex};`).join('\n')}\n}`;
        }

        if (format === 'scss') {
            return `// SCSS Variables\n${shades.map(s => `$${tokenName}-${s.step}: ${s.hex};`).join('\n')}`;
        }

        if (format === 'json') {
            const dtcg = {
                [tokenName]: shades.reduce((acc, s) => {
                    acc[s.step] = {
                        "$value": s.hex,
                        "$type": "color"
                    };
                    return acc;
                }, {})
            };
            return JSON.stringify(dtcg, null, 2);
        }

        return '';
    }

    function update() {
        let hex = baseColorInput.value.trim();
        if (!/^#[0-9A-F]{6}$/i.test(hex)) {
            if (/^[0-9A-F]{6}$/i.test(hex)) {
                hex = '#' + hex;
            } else {
                return;
            }
        }

        colorPicker.value = hex;
        const tokenName = (tokenNameInput.value.trim() || 'primary').toLowerCase().replace(/[^a-z0-9_-]/g, '');
        const shades = generateShadeScale(hex);

        renderSwatches(shades);
        updatePreviewAndContrast(shades);
        exportOutput.value = generateExportCode(shades, tokenName, currentFormat);
    }

    colorPicker.addEventListener('input', (e) => {
        baseColorInput.value = e.target.value.toUpperCase();
        update();
    });

    baseColorInput.addEventListener('input', update);
    tokenNameInput.addEventListener('input', update);

    // Format buttons
    const fmtBtns = {
        tw3: document.getElementById('pal-fmt-tw3'),
        tw4: document.getElementById('pal-fmt-tw4'),
        css: document.getElementById('pal-fmt-css'),
        scss: document.getElementById('pal-fmt-scss'),
        json: document.getElementById('pal-fmt-json')
    };

    Object.keys(fmtBtns).forEach(fmt => {
        fmtBtns[fmt].addEventListener('click', () => {
            Object.values(fmtBtns).forEach(b => b.classList.remove('active'));
            fmtBtns[fmt].classList.add('active');
            currentFormat = fmt;
            update();
        });
    });

    // Preset color buttons
    document.querySelectorAll('.presets-bar .preset-btn[data-hex]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.presets-bar .preset-btn').forEach(b => b.classList.remove('active'));
            e.currentTarget.classList.add('active');
            const hex = e.currentTarget.getAttribute('data-hex');
            baseColorInput.value = hex.toUpperCase();
            colorPicker.value = hex;
            update();
        });
    });

    copyBtn.addEventListener('click', () => {
        Atelier.copyToClipboard(exportOutput.value, 'Design tokens copied to clipboard!');
    });

    downloadBtn.addEventListener('click', () => {
        const ext = currentFormat === 'json' ? 'json' : currentFormat === 'scss' ? 'scss' : 'css';
        Atelier.downloadFile(exportOutput.value, `${tokenNameInput.value.trim() || 'palette'}-tokens.${ext}`, ext === 'json' ? 'application/json' : 'text/css');
    });

    update();
}
