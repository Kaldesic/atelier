export const html = `<h1>PX / REM & Fluid Type Engine</h1>
        <p class="subtitle">Convert CSS units and generate fluid typography clamp formulas.</p>

        <div class="tool-section">
            <h2 class="tool-section-title">Simple Conversion</h2>
            <div style="display: flex; gap: 1rem; align-items: center; margin-bottom: 1rem;">
                <div style="flex: 1;">
                    <label class="input-label">Root Font Size (px)</label>
                    <input type="number" id="rootSize" value="16" class="input-field">
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                <div>
                    <label class="input-label">Pixels (px)</label>
                    <input type="number" id="pxInput" value="16" class="input-field">
                </div>
                <div>
                    <label class="input-label">REM</label>
                    <input type="number" id="remInput" value="1" class="input-field">
                </div>
            </div>
        </div>

        <div style="background: var(--card-bg); padding: 1.5rem; border-radius: 8px; border: 1px solid var(--border);">
            <h2 class="tool-section-title">Fluid Typography (clamp)</h2>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                <div>
                    <label class="input-label">Min Viewport (px)</label>
                    <input type="number" id="minVw" value="320" class="input-field">
                </div>
                <div>
                    <label class="input-label">Max Viewport (px)</label>
                    <input type="number" id="maxVw" value="1280" class="input-field">
                </div>
                <div>
                    <label class="input-label">Min Font Size (rem)</label>
                    <input type="number" id="minFs" value="1" step="0.125" class="input-field">
                </div>
                <div>
                    <label class="input-label">Max Font Size (rem)</label>
                    <input type="number" id="maxFs" value="2" step="0.125" class="input-field">
                </div>
            </div>
            
            <div class="code-box">
                <div class="code-title">CSS Output</div>
                <button class="copy-btn" id="copyClampBtn">Copy</button>
                <pre id="clampOutput"></pre>
            </div>
        </div>`;

export function init() {
const rootSize = document.getElementById('rootSize');
        const pxInput = document.getElementById('pxInput');
        const remInput = document.getElementById('remInput');
        
        const minVw = document.getElementById('minVw');
        const maxVw = document.getElementById('maxVw');
        const minFs = document.getElementById('minFs');
        const maxFs = document.getElementById('maxFs');
        const clampOutput = document.getElementById('clampOutput');
        const copyClampBtn = document.getElementById('copyClampBtn');

        function showToast(message, isError = false) {
            window.Atelier.showToast(message, isError ? 'error' : 'success');
        }

        function updatePxRem(source) {
            const root = parseFloat(rootSize.value) || 16;
            if (source === 'px') {
                const px = parseFloat(pxInput.value) || 0;
                remInput.value = (px / root).toFixed(4).replace(/\.?0+$/, '');
            } else {
                const rem = parseFloat(remInput.value) || 0;
                pxInput.value = (rem * root).toFixed(4).replace(/\.?0+$/, '');
            }
        }

        rootSize.addEventListener('input', () => updatePxRem('px'));
        pxInput.addEventListener('input', () => updatePxRem('px'));
        remInput.addEventListener('input', () => updatePxRem('rem'));

        function calculateClamp() {
            const root = parseFloat(rootSize.value) || 16;
            const wMin = parseFloat(minVw.value) || 320;
            const wMax = parseFloat(maxVw.value) || 1280;
            const vMin = parseFloat(minFs.value) || 1;
            const vMax = parseFloat(maxFs.value) || 2;

            if (wMin === wMax) return;

            const slope = ((vMax - vMin) * root) / (wMax - wMin);
            const intersection = (-wMin * slope) / root;
            
            const preferred = `${(intersection + vMin).toFixed(4).replace(/\.?0+$/, '')}rem + ${(slope * 100).toFixed(4).replace(/\.?0+$/, '')}vw`;
            
            clampOutput.textContent = `font-size: clamp(${vMin}rem, ${preferred}, ${vMax}rem);`;
        }

        [minVw, maxVw, minFs, maxFs, rootSize].forEach(input => {
            input.addEventListener('input', calculateClamp);
        });

        copyClampBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(clampOutput.textContent).then(() => {
                showToast('Copied to clipboard!');
            }).catch(() => showToast('Failed to copy', true));
        });

        calculateClamp();
}
