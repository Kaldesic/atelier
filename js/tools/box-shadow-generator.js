// js/tools/box-shadow-generator.js
export const html = `
    <h1>CSS Box Shadow & Glass Generator</h1>
    <p class="subtitle">Craft layered box shadows, glassmorphic card styles, and copy production-ready CSS with one click.</p>

    <div class="tool-section">
        <div class="presets-bar" style="margin-bottom: 1.5rem;">
            <button class="preset-btn active" id="preset-subtle">Subtle Elevation</button>
            <button class="preset-btn" id="preset-layered">Smooth Layered</button>
            <button class="preset-btn" id="preset-sharp">Hard Neumorph</button>
            <button class="preset-btn" id="preset-glass">Frosted Glass</button>
            <button class="preset-btn" id="preset-glow">Cyber Glow</button>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: center; margin-bottom: 2rem;" class="shadow-layout-grid">
            <!-- Interactive Playground Preview -->
            <div id="previewCanvas" style="min-height: 260px; background: var(--bg); border: 1px solid var(--border); border-radius: 12px; display: flex; align-items: center; justify-content: center; padding: 2rem; position: relative; overflow: hidden;">
                <!-- Decorative background elements for glassmorphism -->
                <div style="position: absolute; width: 100px; height: 100px; border-radius: 50%; background: linear-gradient(135deg, #00e599, #3b82f6); filter: blur(28px); opacity: 0.45; top: 20px; left: 30px; pointer-events: none;"></div>
                <div style="position: absolute; width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #ec4899, #8b5cf6); filter: blur(24px); opacity: 0.45; bottom: 20px; right: 30px; pointer-events: none;"></div>

                <div id="shadowTarget" style="width: 170px; height: 170px; background-color: var(--card-bg); border-radius: 12px; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 0.9rem; font-weight: 600; text-align: center; color: var(--text); padding: 1rem; position: relative; z-index: 2; transition: border-radius 0.15s ease;">
                    <span>Box Preview</span>
                    <span style="font-size: 0.72rem; color: var(--text-muted); font-weight: normal; margin-top: 4px;">Dynamic CSS</span>
                </div>
            </div>

            <!-- Controls Panel -->
            <div style="display: flex; flex-direction: column; gap: 1rem;">
                <div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 0.25rem;">
                        <span style="color: var(--text-muted);">Horizontal Offset (X)</span>
                        <span id="xVal" style="font-family: var(--font-mono);">0px</span>
                    </div>
                    <input type="range" id="xSlider" min="-50" max="50" value="0" style="width: 100%;">
                </div>

                <div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 0.25rem;">
                        <span style="color: var(--text-muted);">Vertical Offset (Y)</span>
                        <span id="yVal" style="font-family: var(--font-mono);">8px</span>
                    </div>
                    <input type="range" id="ySlider" min="-50" max="50" value="8" style="width: 100%;">
                </div>

                <div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 0.25rem;">
                        <span style="color: var(--text-muted);">Blur Radius</span>
                        <span id="blurVal" style="font-family: var(--font-mono);">24px</span>
                    </div>
                    <input type="range" id="blurSlider" min="0" max="100" value="24" style="width: 100%;">
                </div>

                <div>
                    <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 0.25rem;">
                        <span style="color: var(--text-muted);">Spread Radius</span>
                        <span id="spreadVal" style="font-family: var(--font-mono);">0px</span>
                    </div>
                    <input type="range" id="spreadSlider" min="-30" max="50" value="0" style="width: 100%;">
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                    <div>
                        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 0.25rem;">
                            <span style="color: var(--text-muted);">Opacity</span>
                            <span id="opacityVal" style="font-family: var(--font-mono);">15%</span>
                        </div>
                        <input type="range" id="opacitySlider" min="0" max="100" value="15" style="width: 100%;">
                    </div>

                    <div>
                        <div style="display: flex; justify-content: space-between; font-size: 0.82rem; margin-bottom: 0.25rem;">
                            <span style="color: var(--text-muted);">Corner Radius</span>
                            <span id="radiusVal" style="font-family: var(--font-mono);">12px</span>
                        </div>
                        <input type="range" id="radiusSlider" min="0" max="85" value="12" style="width: 100%;">
                    </div>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 0.25rem; flex-wrap: wrap; gap: 0.75rem;">
                    <div style="display: flex; align-items: center; gap: 0.5rem;">
                        <input type="color" id="shadowColorPicker" value="#000000" style="width: 32px; height: 32px; border-radius: 6px; border: 1px solid var(--border); cursor: pointer; background: transparent;">
                        <label for="shadowColorPicker" class="input-label" style="margin-bottom: 0; cursor: pointer;">Shadow Color</label>
                    </div>

                    <label style="display: flex; align-items: center; gap: 0.4rem; font-size: 0.85rem; cursor: pointer;">
                        <input type="checkbox" id="insetCheck"> Inset (Inner Shadow)
                    </label>
                </div>
            </div>
        </div>

        <!-- Generated CSS Code Block -->
        <div class="input-group">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                <label for="cssOutput" class="input-label" style="margin-bottom: 0;">Generated CSS</label>
                <button class="btn btn-outline" id="copyTailwindBtn" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;">Copy as Tailwind Arbitrary</button>
            </div>
            <div style="position: relative;">
                <textarea id="cssOutput" class="textarea-field" style="height: 105px; font-family: var(--font-mono); font-size: 0.85rem;" readonly></textarea>
                <button class="copy-btn" id="copyCssBtn">Copy CSS</button>
            </div>
        </div>
    </div>
`;

export function init() {
    const shadowTarget = document.getElementById('shadowTarget');
    const xSlider = document.getElementById('xSlider');
    const ySlider = document.getElementById('ySlider');
    const blurSlider = document.getElementById('blurSlider');
    const spreadSlider = document.getElementById('spreadSlider');
    const opacitySlider = document.getElementById('opacitySlider');
    const radiusSlider = document.getElementById('radiusSlider');
    const shadowColorPicker = document.getElementById('shadowColorPicker');
    const insetCheck = document.getElementById('insetCheck');

    const xVal = document.getElementById('xVal');
    const yVal = document.getElementById('yVal');
    const blurVal = document.getElementById('blurVal');
    const spreadVal = document.getElementById('spreadVal');
    const opacityVal = document.getElementById('opacityVal');
    const radiusVal = document.getElementById('radiusVal');

    const cssOutput = document.getElementById('cssOutput');
    const copyCssBtn = document.getElementById('copyCssBtn');
    const copyTailwindBtn = document.getElementById('copyTailwindBtn');

    // Preset buttons
    const presetSubtle = document.getElementById('preset-subtle');
    const presetLayered = document.getElementById('preset-layered');
    const presetSharp = document.getElementById('preset-sharp');
    const presetGlass = document.getElementById('preset-glass');
    const presetGlow = document.getElementById('preset-glow');
    const allPresets = [presetSubtle, presetLayered, presetSharp, presetGlass, presetGlow];

    let customMultiShadow = null;
    let customGlassProps = null;

    function hexToRgba(hex, alpha) {
        let c = hex.replace('#', '');
        if (c.length === 3) c = c.split('').map(x => x + x).join('');
        const num = parseInt(c, 16);
        const r = (num >> 16) & 255;
        const g = (num >> 8) & 255;
        const b = num & 255;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    function update() {
        const x = parseInt(xSlider.value, 10);
        const y = parseInt(ySlider.value, 10);
        const blur = parseInt(blurSlider.value, 10);
        const spread = parseInt(spreadSlider.value, 10);
        const opacity = parseInt(opacitySlider.value, 10) / 100;
        const radius = parseInt(radiusSlider.value, 10);
        const color = shadowColorPicker.value;
        const inset = insetCheck.checked ? 'inset ' : '';

        xVal.innerText = `${x}px`;
        yVal.innerText = `${y}px`;
        blurVal.innerText = `${blur}px`;
        spreadVal.innerText = `${spread}px`;
        opacityVal.innerText = `${Math.round(opacity * 100)}%`;
        radiusVal.innerText = `${radius}px`;

        shadowTarget.style.borderRadius = `${radius}px`;

        let shadowString = '';
        let fullCss = '';

        if (customMultiShadow) {
            shadowString = customMultiShadow;
            shadowTarget.style.boxShadow = shadowString;
            if (customGlassProps) {
                shadowTarget.style.background = customGlassProps.background;
                shadowTarget.style.backdropFilter = customGlassProps.backdropFilter;
                shadowTarget.style.border = customGlassProps.border;
            } else {
                shadowTarget.style.background = 'var(--card-bg)';
                shadowTarget.style.backdropFilter = 'none';
                shadowTarget.style.border = 'none';
            }

            fullCss = `border-radius: ${radius}px;\nbox-shadow: ${shadowString};`;
            if (customGlassProps) {
                fullCss = `border-radius: ${radius}px;\nbackground: ${customGlassProps.background};\nbackdrop-filter: ${customGlassProps.backdropFilter};\n-webkit-backdrop-filter: ${customGlassProps.backdropFilter};\nborder: ${customGlassProps.border};\nbox-shadow: ${shadowString};`;
            }
        } else {
            shadowTarget.style.background = 'var(--card-bg)';
            shadowTarget.style.backdropFilter = 'none';
            shadowTarget.style.border = 'none';

            const rgbaColor = hexToRgba(color, opacity);
            shadowString = `${inset}${x}px ${y}px ${blur}px ${spread}px ${rgbaColor}`;
            shadowTarget.style.boxShadow = shadowString;

            fullCss = `border-radius: ${radius}px;\nbox-shadow: ${shadowString};`;
        }

        cssOutput.value = fullCss;
    }

    const sliders = [xSlider, ySlider, blurSlider, spreadSlider, opacitySlider, radiusSlider, shadowColorPicker, insetCheck];
    sliders.forEach(el => {
        const handler = () => {
            customMultiShadow = null;
            customGlassProps = null;
            allPresets.forEach(b => b.classList.remove('active'));
            update();
        };
        el.addEventListener('input', handler);
        el.addEventListener('change', handler);
    });

    // Preset handlers
    function applyPreset(btn, config) {
        allPresets.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        xSlider.value = config.x !== undefined ? config.x : 0;
        ySlider.value = config.y !== undefined ? config.y : 8;
        blurSlider.value = config.blur !== undefined ? config.blur : 24;
        spreadSlider.value = config.spread !== undefined ? config.spread : 0;
        opacitySlider.value = config.opacity !== undefined ? config.opacity : 15;
        radiusSlider.value = config.radius !== undefined ? config.radius : 12;
        shadowColorPicker.value = config.color || '#000000';
        insetCheck.checked = !!config.inset;

        customMultiShadow = config.multiShadow || null;
        customGlassProps = config.glassProps || null;

        update();
    }

    presetSubtle.addEventListener('click', () => applyPreset(presetSubtle, {
        x: 0, y: 4, blur: 16, spread: 0, opacity: 12, radius: 12, color: '#000000'
    }));

    presetLayered.addEventListener('click', () => applyPreset(presetLayered, {
        x: 0, y: 16, blur: 32, spread: 0, opacity: 12, radius: 16, color: '#000000',
        multiShadow: '0 2px 4px rgba(0,0,0,0.04), 0 8px 16px rgba(0,0,0,0.08), 0 16px 32px rgba(0,0,0,0.12)'
    }));

    presetSharp.addEventListener('click', () => applyPreset(presetSharp, {
        x: 6, y: 6, blur: 0, spread: 0, opacity: 80, radius: 8, color: '#00e599'
    }));

    presetGlass.addEventListener('click', () => applyPreset(presetGlass, {
        x: 0, y: 8, blur: 32, spread: 0, opacity: 25, radius: 16, color: '#000000',
        multiShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.25)',
        glassProps: {
            background: 'rgba(255, 255, 255, 0.08)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255, 255, 255, 0.15)'
        }
    }));

    presetGlow.addEventListener('click', () => applyPreset(presetGlow, {
        x: 0, y: 0, blur: 36, spread: 4, opacity: 50, radius: 16, color: '#00e599'
    }));

    copyCssBtn.addEventListener('click', () => {
        if (!cssOutput.value) return;
        navigator.clipboard.writeText(cssOutput.value).then(() => {
            window.Atelier?.showToast('Copied CSS to clipboard!', 'success');
        });
    });

    copyTailwindBtn.addEventListener('click', () => {
        const shadow = shadowTarget.style.boxShadow;
        if (!shadow) return;
        
        // Sanitize for Tailwind Arbitrary values (replace spaces, handle comma formatting)
        const cleanShadow = shadow.replace(/,\s+/g, ',').replace(/\s+/g, '_');
        let twClass = `shadow-[${cleanShadow}] rounded-[${radiusSlider.value}px]`;
        
        if (customGlassProps) {
            twClass += ` bg-[rgba(255,255,255,0.08)] backdrop-blur-[12px] border border-[rgba(255,255,255,0.15)]`;
        }

        navigator.clipboard.writeText(twClass).then(() => {
            window.Atelier?.showToast('Copied Tailwind arbitrary class!', 'success');
        });
    });

    // Initialize
    update();
}
