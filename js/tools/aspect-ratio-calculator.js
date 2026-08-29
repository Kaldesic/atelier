export const html = `<h1>Aspect Ratio Calculator</h1>
        <p class="subtitle">Calculate proportional width and height for responsive web layouts and video containers.</p>

        <div class="presets-bar">
            <button class="preset-btn" id="ratio-16-9">16:9 Widescreen</button>
            <button class="preset-btn" id="ratio-4-3">4:3 Standard</button>
            <button class="preset-btn" id="ratio-1-1">1:1 Square</button>
            <button class="preset-btn" id="ratio-21-9">21:9 Ultrawide</button>
            <button class="preset-btn" id="ratio-9-16">9:16 Vertical</button>
        </div>

        <div class="calculator-card">
            <div class="ratio-row">
                <div class="input-group">
                    <label class="input-label">Ratio Width (W1)</label>
                    <input type="number" class="input-field" id="rW" value="16" min="0.1" step="any">
                </div>
                <div class="input-group">
                    <label class="input-label">Ratio Height (H1)</label>
                    <input type="number" class="input-field" id="rH" value="9" min="0.1" step="any">
                </div>
            </div>

            <div class="dimension-row">
                <div class="input-group">
                    <label class="input-label">Target Width (W2 px)</label>
                    <input type="number" class="input-field" id="tW" value="1920" min="1">
                </div>
                <div class="input-group">
                    <label class="input-label">Target Height (H2 px)</label>
                    <input type="number" class="input-field" id="tH" min="1">
                </div>
            </div>

            <div class="preview-box" id="previewBox" title="Click to copy dimensions">
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
        const maxW = 200;
        const maxH = 120;
        const ratio = rw / rh;

        let w = maxW;
        let h = maxW / ratio;

        if (h > maxH) {
            h = maxH;
            w = maxH * ratio;
        }

        visualRect.style.width = `${Math.max(15, w)}px`;
        visualRect.style.height = `${Math.max(15, h)}px`;
        resultText.innerText = `${tW.value || 0} × ${tH.value || 0} px (${rw}:${rh})`;
    }

    rW.addEventListener('input', () => calculate());
    rH.addEventListener('input', () => calculate());
    tW.addEventListener('input', () => { lastModified = 'w'; calculate(); });
    tH.addEventListener('input', () => { lastModified = 'h'; calculate(); });

    document.getElementById('ratio-16-9').addEventListener('click', () => setRatio(16, 9));
    document.getElementById('ratio-4-3').addEventListener('click', () => setRatio(4, 3));
    document.getElementById('ratio-1-1').addEventListener('click', () => setRatio(1, 1));
    document.getElementById('ratio-21-9').addEventListener('click', () => setRatio(21, 9));
    document.getElementById('ratio-9-16').addEventListener('click', () => setRatio(9, 16));
    document.getElementById('previewBox').addEventListener('click', copyDimensions);

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
}
