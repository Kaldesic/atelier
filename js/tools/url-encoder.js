export const html = `
    <h1>URL Encoder & Query Parser</h1>
    <p class="subtitle">Encode, decode URLs, and parse complex query parameters into structured data in real-time.</p>

    <div class="tool-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
            <div class="presets-bar" style="margin-bottom: 0;">
                <button class="preset-btn active" id="mode-encode">Encode Component</button>
                <button class="preset-btn" id="mode-encode-full">Encode Full URI</button>
                <button class="preset-btn" id="mode-decode">Decode</button>
            </div>
            <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-outline" id="sampleBtn" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;">Load Sample</button>
                <button class="btn btn-outline" id="clearBtn" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;">Clear</button>
            </div>
        </div>

        <div class="input-group">
            <label for="urlInput" class="input-label">Input URL or Text</label>
            <textarea id="urlInput" class="textarea-field" style="height: 110px; font-family: var(--font-mono); font-size: 0.85rem;" placeholder="Paste URL or raw string here..."></textarea>
        </div>

        <div class="input-group">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                <label for="urlOutput" class="input-label" style="margin-bottom: 0;">Processed Output</label>
                <span id="charCount" class="result-meta">0 characters</span>
            </div>
            <div style="position: relative;">
                <textarea id="urlOutput" class="textarea-field" style="height: 110px; font-family: var(--font-mono); font-size: 0.85rem;" readonly placeholder="Result will appear here..."></textarea>
                <button class="copy-btn" id="copyResultBtn">Copy</button>
            </div>
        </div>
    </div>

    <div class="tool-section" id="queryParamsSection">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
            <h2 class="tool-section-title" style="margin-bottom: 0;">Parsed Query Parameters</h2>
            <button class="btn btn-outline" id="copyJsonBtn" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;">Copy as JSON</button>
        </div>
        
        <div id="paramsTableContainer">
            <p id="noParamsMsg" style="color: var(--text-muted); font-size: 0.9rem;">No query parameters detected in the input.</p>
            <div id="paramsTable" style="display: none; width: 100%; overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
                    <thead>
                        <tr style="border-bottom: 1px solid var(--border); color: var(--text-muted);">
                            <th style="padding: 0.5rem; font-weight: 600;">Key</th>
                            <th style="padding: 0.5rem; font-weight: 600;">Value</th>
                            <th style="padding: 0.5rem; text-align: right; width: 60px;">Action</th>
                        </tr>
                    </thead>
                    <tbody id="paramsBody"></tbody>
                </table>
            </div>
        </div>
    </div>
`;

export function init() {
    const urlInput = document.getElementById('urlInput');
    const urlOutput = document.getElementById('urlOutput');
    const charCount = document.getElementById('charCount');
    const copyResultBtn = document.getElementById('copyResultBtn');
    const copyJsonBtn = document.getElementById('copyJsonBtn');
    const clearBtn = document.getElementById('clearBtn');
    const sampleBtn = document.getElementById('sampleBtn');
    
    const modeEncode = document.getElementById('mode-encode');
    const modeEncodeFull = document.getElementById('mode-encode-full');
    const modeDecode = document.getElementById('mode-decode');
    
    const paramsTable = document.getElementById('paramsTable');
    const noParamsMsg = document.getElementById('noParamsMsg');
    const paramsBody = document.getElementById('paramsBody');

    let currentMode = 'encode'; // 'encode' | 'encodeFull' | 'decode'
    let currentParsedParams = {};

    function showToast(msg, isError = false) {
        window.Atelier.showToast(msg, isError ? 'error' : 'success');
    }

    function setMode(mode) {
        currentMode = mode;
        [modeEncode, modeEncodeFull, modeDecode].forEach(btn => btn.classList.remove('active', 'btn-primary'));
        if (mode === 'encode') modeEncode.classList.add('active');
        if (mode === 'encodeFull') modeEncodeFull.classList.add('active');
        if (mode === 'decode') modeDecode.classList.add('active');
        process();
    }

    modeEncode.addEventListener('click', () => setMode('encode'));
    modeEncodeFull.addEventListener('click', () => setMode('encodeFull'));
    modeDecode.addEventListener('click', () => setMode('decode'));

    function process() {
        const val = urlInput.value;
        charCount.innerText = `${val.length} character${val.length === 1 ? '' : 's'}`;

        if (!val) {
            urlOutput.value = '';
            renderQueryParams({});
            return;
        }

        try {
            let result = '';
            if (currentMode === 'encode') {
                result = encodeURIComponent(val);
            } else if (currentMode === 'encodeFull') {
                result = encodeURI(val);
            } else if (currentMode === 'decode') {
                try {
                    result = decodeURIComponent(val.replace(/\+/g, ' '));
                } catch {
                    result = decodeURI(val);
                }
            }
            urlOutput.value = result;
        } catch (err) {
            urlOutput.value = 'Error: Invalid URI component';
        }

        extractParams(val);
    }

    function extractParams(str) {
        let queryString = '';
        if (str.includes('?')) {
            queryString = str.split('?')[1].split('#')[0];
        } else if (str.includes('=')) {
            queryString = str;
        }

        const params = {};
        if (queryString) {
            const pairs = queryString.split('&');
            for (const pair of pairs) {
                if (!pair) continue;
                const [rawK, ...rawV] = pair.split('=');
                try {
                    const k = decodeURIComponent(rawK.trim());
                    const v = decodeURIComponent(rawV.join('=').trim());
                    if (k) {
                        params[k] = v;
                    }
                } catch {
                    params[rawK] = rawV.join('=');
                }
            }
        }

        currentParsedParams = params;
        renderQueryParams(params);
    }

    function renderQueryParams(params) {
        const keys = Object.keys(params);
        if (keys.length === 0) {
            paramsTable.style.display = 'none';
            noParamsMsg.style.display = 'block';
            paramsBody.innerHTML = '';
            return;
        }

        paramsTable.style.display = 'table';
        noParamsMsg.style.display = 'none';

        paramsBody.innerHTML = keys.map(k => {
            const v = params[k];
            return `
                <tr style="border-bottom: 1px solid var(--border);">
                    <td style="padding: 0.5rem; font-family: var(--font-mono); color: var(--accent); font-weight: 500;">${escapeHtml(k)}</td>
                    <td style="padding: 0.5rem; font-family: var(--font-mono); word-break: break-all;">${escapeHtml(v)}</td>
                    <td style="padding: 0.5rem; text-align: right;">
                        <button class="btn btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;" data-copy-val="${escapeHtml(v)}">Copy</button>
                    </td>
                </tr>
            `;
        }).join('');

        paramsBody.querySelectorAll('[data-copy-val]').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const text = e.currentTarget.getAttribute('data-copy-val');
                navigator.clipboard.writeText(text).then(() => showToast('Copied parameter value!'));
            });
        });
    }

    function escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    urlInput.addEventListener('input', process);

    copyResultBtn.addEventListener('click', () => {
        if (!urlOutput.value) return;
        navigator.clipboard.writeText(urlOutput.value).then(() => {
            showToast('Copied result to clipboard!');
        }).catch(() => showToast('Failed to copy', true));
    });

    copyJsonBtn.addEventListener('click', () => {
        if (Object.keys(currentParsedParams).length === 0) {
            showToast('No query parameters to copy', true);
            return;
        }
        navigator.clipboard.writeText(JSON.stringify(currentParsedParams, null, 2)).then(() => {
            showToast('Copied parameters as JSON!');
        }).catch(() => showToast('Failed to copy JSON', true));
    });

    clearBtn.addEventListener('click', () => {
        urlInput.value = '';
        process();
        urlInput.focus();
    });

    sampleBtn.addEventListener('click', () => {
        urlInput.value = 'https://example.com/api/v1/search?query=web+development&category=developer%20tools&page=1&limit=20&sort=desc#results';
        setMode('decode');
        showToast('Sample URL loaded!');
    });
}
