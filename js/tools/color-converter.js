// js/tools/color-converter.js
export const html = `
    <h1>Color Converter & Contrast Matrix</h1>
    <p class="subtitle">Convert between HEX, RGB, HSL color spaces and test WCAG 2.1 accessibility compliance in real time.</p>

    <div class="tool-section">
        <h2 class="tool-section-title" style="margin-bottom: 1rem;">Color Values</h2>
        
        <div style="display: flex; gap: 1.5rem; align-items: center; margin-bottom: 1.5rem; flex-wrap: wrap;">
            <div style="position: relative;">
                <input type="color" id="nativeColorPicker" value="#00e599" style="width: 64px; height: 64px; border-radius: 12px; border: 2px solid var(--border); cursor: pointer; background: transparent; padding: 2px;">
            </div>
            <div style="flex: 1; min-width: 200px;">
                <div class="input-label" style="margin-bottom: 0.25rem;">Active Color Preview</div>
                <div id="colorSampleBar" style="height: 36px; border-radius: 8px; background-color: #00e599; border: 1px solid var(--border); display: flex; align-items: center; padding-left: 1rem; font-family: var(--font-mono); font-size: 0.85rem; font-weight: 600; color: #0f1115; transition: background-color 0.1s ease;">
                    #00e599
                </div>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem;">
            <div class="input-group">
                <label for="hexInput" class="input-label">HEX</label>
                <div style="position: relative;">
                    <input type="text" id="hexInput" class="input-field" value="#00e599" style="font-family: var(--font-mono);">
                    <button class="copy-btn" data-copy-target="hexInput">Copy</button>
                </div>
            </div>

            <div class="input-group">
                <label for="rgbInput" class="input-label">RGB</label>
                <div style="position: relative;">
                    <input type="text" id="rgbInput" class="input-field" value="rgb(0, 229, 153)" style="font-family: var(--font-mono);">
                    <button class="copy-btn" data-copy-target="rgbInput">Copy</button>
                </div>
            </div>

            <div class="input-group">
                <label for="hslInput" class="input-label">HSL</label>
                <div style="position: relative;">
                    <input type="text" id="hslInput" class="input-field" value="hsl(160, 100%, 45%)" style="font-family: var(--font-mono);">
                    <button class="copy-btn" data-copy-target="hslInput">Copy</button>
                </div>
            </div>
        </div>

        <!-- Color Sliders -->
        <div style="margin-top: 1.5rem; display: flex; flex-direction: column; gap: 0.85rem;">
            <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 0.25rem;">
                    <span style="color: var(--text-muted);">Red</span>
                    <span id="rVal" style="font-family: var(--font-mono);">0</span>
                </div>
                <input type="range" id="rSlider" min="0" max="255" value="0" style="width: 100%; accent-color: #ef4444;">
            </div>

            <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 0.25rem;">
                    <span style="color: var(--text-muted);">Green</span>
                    <span id="gVal" style="font-family: var(--font-mono);">229</span>
                </div>
                <input type="range" id="gSlider" min="0" max="255" value="229" style="width: 100%; accent-color: #10b981;">
            </div>

            <div>
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 0.25rem;">
                    <span style="color: var(--text-muted);">Blue</span>
                    <span id="bVal" style="font-family: var(--font-mono);">153</span>
                </div>
                <input type="range" id="bSlider" min="0" max="255" value="153" style="width: 100%; accent-color: #3b82f6;">
            </div>
        </div>
    </div>

    <!-- WCAG Contrast Matrix -->
    <div class="tool-section">
        <h2 class="tool-section-title" style="margin-bottom: 1rem;">WCAG 2.1 Contrast Checker</h2>
        
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.5rem;" class="contrast-inputs-grid">
            <div class="input-group">
                <label for="textColorInput" class="input-label">Foreground (Text)</label>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                    <input type="color" id="textColorPicker" value="#00e599" style="width: 38px; height: 38px; border-radius: 6px; border: 1px solid var(--border); cursor: pointer; padding: 1px; background: transparent;">
                    <input type="text" id="textColorInput" class="input-field" value="#00e599" style="font-family: var(--font-mono); font-size: 0.85rem;">
                </div>
            </div>

            <div class="input-group">
                <label for="bgColorInput" class="input-label">Background</label>
                <div style="display: flex; gap: 0.5rem; align-items: center;">
                    <input type="color" id="bgColorPicker" value="#0f1115" style="width: 38px; height: 38px; border-radius: 6px; border: 1px solid var(--border); cursor: pointer; padding: 1px; background: transparent;">
                    <input type="text" id="bgColorInput" class="input-field" value="#0f1115" style="font-family: var(--font-mono); font-size: 0.85rem;">
                </div>
            </div>
        </div>

        <!-- Live Contrast Preview Box -->
        <div id="contrastPreviewBox" style="background-color: #0f1115; color: #00e599; padding: 1.5rem; border-radius: 8px; border: 1px solid var(--border); margin-bottom: 1.5rem; transition: all 0.15s ease;">
            <div style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;" id="previewHeading">
                Large Heading Text (18pt / 24px bold)
            </div>
            <div style="font-size: 0.95rem; line-height: 1.5;" id="previewBody">
                Normal body text preview. Good contrast ensures readability and accessibility for users with low vision or color vision deficiencies.
            </div>
        </div>

        <!-- Contrast Score & Badges -->
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; background: var(--bg); padding: 1rem; border-radius: 8px; border: 1px solid var(--border);">
            <div>
                <div style="font-size: 0.8rem; color: var(--text-muted); text-transform: uppercase; letter-spacing: 0.05em; font-weight: 600;">Contrast Ratio</div>
                <div id="contrastRatioDisplay" style="font-size: 2rem; font-weight: 700; font-family: var(--font-mono); color: var(--text);">
                    12.4 : 1
                </div>
            </div>

            <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
                <div id="badge-aa-normal" class="wcag-badge">AA Normal: <span class="badge-status">PASS</span></div>
                <div id="badge-aa-large" class="wcag-badge">AA Large: <span class="badge-status">PASS</span></div>
                <div id="badge-aaa-normal" class="wcag-badge">AAA Normal: <span class="badge-status">PASS</span></div>
                <div id="badge-aaa-large" class="wcag-badge">AAA Large: <span class="badge-status">PASS</span></div>
            </div>
        </div>
    </div>
`;

export function init() {
    // Single Color Section Elements
    const nativeColorPicker = document.getElementById('nativeColorPicker');
    const colorSampleBar = document.getElementById('colorSampleBar');
    const hexInput = document.getElementById('hexInput');
    const rgbInput = document.getElementById('rgbInput');
    const hslInput = document.getElementById('hslInput');
    const rSlider = document.getElementById('rSlider');
    const gSlider = document.getElementById('gSlider');
    const bSlider = document.getElementById('bSlider');
    const rVal = document.getElementById('rVal');
    const gVal = document.getElementById('gVal');
    const bVal = document.getElementById('bVal');

    // Contrast Section Elements
    const textColorPicker = document.getElementById('textColorPicker');
    const textColorInput = document.getElementById('textColorInput');
    const bgColorPicker = document.getElementById('bgColorPicker');
    const bgColorInput = document.getElementById('bgColorInput');
    const contrastPreviewBox = document.getElementById('contrastPreviewBox');
    const contrastRatioDisplay = document.getElementById('contrastRatioDisplay');

    const badgeAANormal = document.getElementById('badge-aa-normal');
    const badgeAALarge = document.getElementById('badge-aa-large');
    const badgeAAANormal = document.getElementById('badge-aaa-normal');
    const badgeAAALarge = document.getElementById('badge-aaa-large');

    // Helper functions
    function hexToRgb(hex) {
        if (!hex) return null;
        let cleanHex = hex.replace('#', '').trim();
        if (cleanHex.length === 3) {
            cleanHex = cleanHex.split('').map(c => c + c).join('');
        }
        if (cleanHex.length !== 6) return null;
        const num = parseInt(cleanHex, 16);
        if (isNaN(num)) return null;
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
        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h, s;
        const l = (max + min) / 2;

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
        return {
            h: Math.round(h * 360),
            s: Math.round(s * 100),
            l: Math.round(l * 100)
        };
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
                if (t < 1/6) return p + (q - p) * 6 * t;
                if (t < 1/2) return q;
                if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
                return p;
            };
            const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
            const p = 2 * l - q;
            r = hue2rgb(p, q, h + 1/3);
            g = hue2rgb(p, q, h);
            b = hue2rgb(p, q, h - 1/3);
        }
        return {
            r: Math.round(r * 255),
            g: Math.round(g * 255),
            b: Math.round(b * 255)
        };
    }

    function updateFromRgb(r, g, b, sourceElement = null) {
        r = Math.max(0, Math.min(255, r));
        g = Math.max(0, Math.min(255, g));
        b = Math.max(0, Math.min(255, b));

        const hex = rgbToHex(r, g, b);
        const hsl = rgbToHsl(r, g, b);

        nativeColorPicker.value = hex;
        colorSampleBar.style.backgroundColor = hex;
        colorSampleBar.innerText = hex;
        
        // Dynamic text color on sample bar based on luminance
        const lum = getLuminance(r, g, b);
        colorSampleBar.style.color = lum > 0.4 ? '#0f1115' : '#ffffff';

        // Update inputs only if they were not the source of change (prevents caret jumping)
        if (sourceElement !== hexInput) hexInput.value = hex;
        if (sourceElement !== rgbInput) rgbInput.value = `rgb(${r}, ${g}, ${b})`;
        if (sourceElement !== hslInput) hslInput.value = `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`;

        rSlider.value = r;
        gSlider.value = g;
        bSlider.value = b;
        rVal.innerText = r;
        gVal.innerText = g;
        bVal.innerText = b;
    }

    // Sliders Event Handlers
    [rSlider, gSlider, bSlider].forEach(slider => {
        const handleSlider = () => {
            updateFromRgb(parseInt(rSlider.value, 10), parseInt(gSlider.value, 10), parseInt(bSlider.value, 10));
        };
        slider.addEventListener('input', handleSlider);
        slider.addEventListener('change', handleSlider);
    });

    // Native Color Picker Event Handlers
    ['input', 'change'].forEach(evt => {
        nativeColorPicker.addEventListener(evt, (e) => {
            const rgb = hexToRgb(e.target.value);
            if (rgb) updateFromRgb(rgb.r, rgb.g, rgb.b, nativeColorPicker);
        });
    });

    // Text Inputs Event Handlers
    hexInput.addEventListener('input', (e) => {
        const rgb = hexToRgb(e.target.value);
        if (rgb) updateFromRgb(rgb.r, rgb.g, rgb.b, hexInput);
    });

    rgbInput.addEventListener('input', (e) => {
        const match = e.target.value.match(/(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/);
        if (match) {
            updateFromRgb(parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10), rgbInput);
        }
    });

    hslInput.addEventListener('input', (e) => {
        const match = e.target.value.match(/(\d+)\s*,\s*(\d+)%?\s*,\s*(\d+)%?/);
        if (match) {
            const rgb = hslToRgb(parseInt(match[1], 10), parseInt(match[2], 10), parseInt(match[3], 10));
            updateFromRgb(rgb.r, rgb.g, rgb.b, hslInput);
        }
    });

    // Copy Button Functionality
    document.querySelectorAll('[data-copy-target]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetId = e.currentTarget.getAttribute('data-copy-target');
            const target = document.getElementById(targetId);
            if (target && target.value) {
                navigator.clipboard.writeText(target.value).then(() => {
                    window.Atelier?.showToast('Copied to clipboard!', 'success');
                });
            }
        });
    });

    // --- WCAG Contrast Calculations ---
    function getLuminance(r, g, b) {
        const a = [r, g, b].map(v => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
    }

    function calculateContrast(rgb1, rgb2) {
        const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
        const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
        const brightest = Math.max(lum1, lum2);
        const darkest = Math.min(lum1, lum2);
        return (brightest + 0.05) / (darkest + 0.05);
    }

    function updateContrast() {
        const textHex = textColorInput.value;
        const bgHex = bgColorInput.value;

        const textRgb = hexToRgb(textHex);
        const bgRgb = hexToRgb(bgHex);

        if (!textRgb || !bgRgb) return;

        // Ensure pickers display full 6-digit valid HEX
        textColorPicker.value = rgbToHex(textRgb.r, textRgb.g, textRgb.b);
        bgColorPicker.value = rgbToHex(bgRgb.r, bgRgb.g, bgRgb.b);

        contrastPreviewBox.style.color = textHex;
        contrastPreviewBox.style.backgroundColor = bgHex;

        const ratio = calculateContrast(textRgb, bgRgb);
        const formattedRatio = (Math.round(ratio * 100) / 100).toFixed(2);
        contrastRatioDisplay.innerText = `${formattedRatio} : 1`;

        // Apply badges status
        updateBadge(badgeAANormal, ratio >= 4.5);
        updateBadge(badgeAALarge, ratio >= 3.0);
        updateBadge(badgeAAANormal, ratio >= 7.0);
        updateBadge(badgeAAALarge, ratio >= 4.5);
    }

    function updateBadge(badgeEl, isPass) {
        if (!badgeEl) return;
        const statusSpan = badgeEl.querySelector('.badge-status');
        if (isPass) {
            badgeEl.className = 'wcag-badge badge-pass';
            if (statusSpan) statusSpan.innerText = 'PASS';
        } else {
            badgeEl.className = 'wcag-badge badge-fail';
            if (statusSpan) statusSpan.innerText = 'FAIL';
        }
    }

    // Contrast Inputs Event Handlers
    ['input', 'change'].forEach(evt => {
        textColorPicker.addEventListener(evt, (e) => {
            textColorInput.value = e.target.value;
            updateContrast();
        });

        bgColorPicker.addEventListener(evt, (e) => {
            bgColorInput.value = e.target.value;
            updateContrast();
        });
    });

    textColorInput.addEventListener('input', (e) => {
        if (hexToRgb(e.target.value)) {
            updateContrast();
        }
    });

    bgColorInput.addEventListener('input', (e) => {
        if (hexToRgb(e.target.value)) {
            updateContrast();
        }
    });

    // Initial update execution
    updateFromRgb(0, 229, 153);
    updateContrast();
}
