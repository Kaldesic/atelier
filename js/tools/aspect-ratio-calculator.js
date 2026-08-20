export const html = `<h1>Aspect Ratio Calculator</h1>
        <p class="subtitle">Calculate proportional width and height for responsive web layouts and video containers.</p>

        <div class="presets-bar">
            <button class="preset-btn" onclick="setRatio(16, 9)">16:9 Widescreen</button>
            <button class="preset-btn" onclick="setRatio(4, 3)">4:3 Standard</button>
            <button class="preset-btn" onclick="setRatio(1, 1)">1:1 Square</button>
            <button class="preset-btn" onclick="setRatio(21, 9)">21:9 Ultrawide</button>
            <button class="preset-btn" onclick="setRatio(9, 16)">9:16 Vertical</button>
        </div>

        <div class="calculator-card">
            <div class="ratio-row">
                <div class="input-group">
                    <label>Ratio Width (W1)</label>
                    <input type="number" id="rW" value="16" min="0.1" step="any">
                </div>
                <div class="input-group">
                    <label>Ratio Height (H1)</label>
                    <input type="number" id="rH" value="9" min="0.1" step="any">
                </div>
            </div>

            <div class="dimension-row">
                <div class="input-group">
                    <label>Target Width (W2 px)</label>
                    <input type="number" id="tW" value="1920" min="1">
                </div>
                <div class="input-group">
                    <label>Target Height (H2 px)</label>
                    <input type="number" id="tH" min="1">
                </div>
            </div>

            <div class="preview-box" onclick="copyDimensions()" title="Click to copy dimensions">
                <div class="visual-rect" id="visualRect"></div>
                <div class="result-badge" id="resultText">1920 × 1080 px (Click to copy)</div>
            </div>
        </div>`;

export function init() {
const rW = document.getElementById('rW');
        const rH = document.getElementById('rH');
        const tW = document.getElementById('tW');
        const tH = document.getElementById('tH');
        const visualRect = document.getElementById('visualRect');
        const resultText = document.getElementById('resultText');

        let lastModified = 'w';

        function showToast(message, isError = false) {
            window.Atelier.showToast(message, isError ? 'error' : 'success');
        }

        function calculate() {
            const rwVal = parseFloat(rW.value);
            const rhVal = parseFloat(rH.value);

            if (isNaN(rwVal) || rwVal <= 0 || isNaN(rhVal) || rhVal <= 0) {
                showToast('Ratio dimensions must be greater than 0', true);
                tH.value = '';
                tW.value = '';
                resultText.innerText = 'Invalid ratio';
                visualRect.style.width = '0px';
                visualRect.style.height = '0px';
                return;
            }

            if (lastModified === 'w') {
                const twVal = parseFloat(tW.value);
                if (isNaN(twVal) || twVal <= 0) {
                    tH.value = '';
                    resultText.innerText = 'Enter valid width';
                    return;
                }
                const computedH = Math.round((twVal * rhVal) / rwVal);
                tH.value = computedH;
            } else {
                const thVal = parseFloat(tH.value);
                if (isNaN(thVal) || thVal <= 0) {
                    tW.value = '';
                    resultText.innerText = 'Enter valid height';
                    return;
                }
                const computedW = Math.round((thVal * rwVal) / rhVal);
                tW.value = computedW;
            }

            updatePreview(rwVal, rhVal);
        }

        function updatePreview(rw, rh) {
            const containerMax = 140;
            const ratio = rw / rh;

            let w, h;
            if (ratio >= 1) {
                w = Math.min(220, containerMax * ratio);
                h = w / ratio;
            } else {
                h = containerMax;
                w = h * ratio;
            }

            visualRect.style.width = `${Math.max(20, w)}px`;
            visualRect.style.height = `${Math.max(20, h)}px`;
            resultText.innerText = `${tW.value || 0} × ${tH.value || 0} px (${rw}:${rh})`;
        }

        rW.addEventListener('input', () => calculate());
        rH.addEventListener('input', () => calculate());
        tW.addEventListener('input', () => { lastModified = 'w'; calculate(); });
        tH.addEventListener('input', () => { lastModified = 'h'; calculate(); });

        function setRatio(w, h) {
            rW.value = w;
            rH.value = h;
            lastModified = 'w';
            calculate();
            showToast(`Applied preset ${w}:${h}`);
        }

        function copyDimensions() {
            const textToCopy = `${tW.value || 0}x${tH.value || 0}`;
            if (!tW.value || !tH.value || tW.value === '0' || tH.value === '0') return;
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                showToast(`Copied ${textToCopy} to clipboard!`);
            }).catch(() => {
                showToast('Failed to copy', true);
            });
        }

        calculate();

        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('../sw.js')
                    .then(reg => console.log('PWA Ready:', reg.scope))
                    .catch(err => console.error('SW registration failed:', err));
            });
        }
}