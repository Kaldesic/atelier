export const html = `
    <h1>HTML Entity Encoder & Escaper</h1>
    <p class="subtitle">Convert special characters to HTML entities, decode named or numerical entities, and prevent XSS injection issues.</p>

    <div class="tool-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
            <div class="presets-bar" style="margin-bottom: 0;">
                <button class="preset-btn active" id="btn-escape-named">Named Entities (&amp;copy;)</button>
                <button class="preset-btn" id="btn-escape-numeric">Numeric (&#38;#169;)</button>
                <button class="preset-btn" id="btn-escape-hex">Hex (&#38;#xA9;)</button>
                <button class="preset-btn" id="btn-unescape">Decode to Text</button>
            </div>
            <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-outline" id="sampleBtn" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;">Load Sample</button>
                <button class="btn btn-outline" id="clearBtn" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;">Clear</button>
            </div>
        </div>

        <div class="input-group">
            <label for="entityInput" class="input-label">Input String</label>
            <textarea id="entityInput" class="textarea-field" style="height: 120px; font-family: var(--font-mono); font-size: 0.85rem;" placeholder="Enter text or HTML code here..."></textarea>
        </div>

        <div class="input-group">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                <label for="entityOutput" class="input-label" style="margin-bottom: 0;">Output String</label>
                <span id="entityCount" class="result-meta">0 characters</span>
            </div>
            <div style="position: relative;">
                <textarea id="entityOutput" class="textarea-field" style="height: 120px; font-family: var(--font-mono); font-size: 0.85rem;" readonly placeholder="Processed entities will appear here..."></textarea>
                <button class="copy-btn" id="copyEntityBtn">Copy</button>
            </div>
        </div>
    </div>

    <!-- Quick Reference Table -->
    <div class="tool-section">
        <h2 class="tool-section-title" style="margin-bottom: 0.8rem;">Common Entity Quick Reference</h2>
        <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
                <thead>
                    <tr style="border-bottom: 1px solid var(--border); color: var(--text-muted);">
                        <th style="padding: 0.5rem;">Char</th>
                        <th style="padding: 0.5rem;">Named</th>
                        <th style="padding: 0.5rem;">Dec Number</th>
                        <th style="padding: 0.5rem;">Description</th>
                        <th style="padding: 0.5rem; text-align: right;">Insert</th>
                    </tr>
                </thead>
                <tbody id="quickRefBody">
                    <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.5rem; font-weight: 700;">&lt;</td><td style="padding: 0.5rem; font-family: var(--font-mono); color: var(--accent);">&amp;lt;</td><td style="padding: 0.5rem; font-family: var(--font-mono);">&#38;#60;</td><td style="padding: 0.5rem; color: var(--text-muted);">Less than</td><td style="padding: 0.5rem; text-align: right;"><button class="btn btn-outline insert-btn" data-insert="&lt;" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;">Insert</button></td></tr>
                    <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.5rem; font-weight: 700;">&gt;</td><td style="padding: 0.5rem; font-family: var(--font-mono); color: var(--accent);">&amp;gt;</td><td style="padding: 0.5rem; font-family: var(--font-mono);">&#38;#62;</td><td style="padding: 0.5rem; color: var(--text-muted);">Greater than</td><td style="padding: 0.5rem; text-align: right;"><button class="btn btn-outline insert-btn" data-insert="&gt;" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;">Insert</button></td></tr>
                    <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.5rem; font-weight: 700;">&amp;</td><td style="padding: 0.5rem; font-family: var(--font-mono); color: var(--accent);">&amp;amp;</td><td style="padding: 0.5rem; font-family: var(--font-mono);">&#38;#38;</td><td style="padding: 0.5rem; color: var(--text-muted);">Ampersand</td><td style="padding: 0.5rem; text-align: right;"><button class="btn btn-outline insert-btn" data-insert="&amp;" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;">Insert</button></td></tr>
                    <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.5rem; font-weight: 700;">"</td><td style="padding: 0.5rem; font-family: var(--font-mono); color: var(--accent);">&amp;quot;</td><td style="padding: 0.5rem; font-family: var(--font-mono);">&#38;#34;</td><td style="padding: 0.5rem; color: var(--text-muted);">Double quotation</td><td style="padding: 0.5rem; text-align: right;"><button class="btn btn-outline insert-btn" data-insert="&quot;" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;">Insert</button></td></tr>
                    <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.5rem; font-weight: 700;">'</td><td style="padding: 0.5rem; font-family: var(--font-mono); color: var(--accent);">&amp;apos;</td><td style="padding: 0.5rem; font-family: var(--font-mono);">&#38;#39;</td><td style="padding: 0.5rem; color: var(--text-muted);">Single quote / apostrophe</td><td style="padding: 0.5rem; text-align: right;"><button class="btn btn-outline insert-btn" data-insert="'" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;">Insert</button></td></tr>
                    <tr style="border-bottom: 1px solid var(--border);"><td style="padding: 0.5rem; font-weight: 700;">©</td><td style="padding: 0.5rem; font-family: var(--font-mono); color: var(--accent);">&amp;copy;</td><td style="padding: 0.5rem; font-family: var(--font-mono);">&#38;#169;</td><td style="padding: 0.5rem; color: var(--text-muted);">Copyright symbol</td><td style="padding: 0.5rem; text-align: right;"><button class="btn btn-outline insert-btn" data-insert="©" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;">Insert</button></td></tr>
                    <tr><td style="padding: 0.5rem; font-weight: 700;">—</td><td style="padding: 0.5rem; font-family: var(--font-mono); color: var(--accent);">&amp;mdash;</td><td style="padding: 0.5rem; font-family: var(--font-mono);">&#38;#8212;</td><td style="padding: 0.5rem; color: var(--text-muted);">Em dash</td><td style="padding: 0.5rem; text-align: right;"><button class="btn btn-outline insert-btn" data-insert="—" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;">Insert</button></td></tr>
                </tbody>
            </table>
        </div>
    </div>
`;

export function init() {
    const entityInput = document.getElementById('entityInput');
    const entityOutput = document.getElementById('entityOutput');
    const entityCount = document.getElementById('entityCount');
    const copyEntityBtn = document.getElementById('copyEntityBtn');
    const sampleBtn = document.getElementById('sampleBtn');
    const clearBtn = document.getElementById('clearBtn');

    const btnNamed = document.getElementById('btn-escape-named');
    const btnNumeric = document.getElementById('btn-escape-numeric');
    const btnHex = document.getElementById('btn-escape-hex');
    const btnUnescape = document.getElementById('btn-unescape');

    let currentMode = 'named';

    const NAMED_MAP = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '©': '&copy;',
        '®': '&reg;',
        '™': '&trade;',
        '€': '&euro;',
        '£': '&pound;',
        '¥': '&yen;',
        '§': '&sect;',
        '°': '&deg;',
        '±': '&plusmn;',
        '×': '&times;',
        '÷': '&divide;',
        '—': '&mdash;',
        '–': '&ndash;',
        '…': '&hellip;',
        '•': '&bull;'
    };

    function setMode(mode) {
        currentMode = mode;
        [btnNamed, btnNumeric, btnHex, btnUnescape].forEach(b => b.classList.remove('active'));
        if (mode === 'named') btnNamed.classList.add('active');
        if (mode === 'numeric') btnNumeric.classList.add('active');
        if (mode === 'hex') btnHex.classList.add('active');
        if (mode === 'unescape') btnUnescape.classList.add('active');
        process();
    }

    btnNamed.addEventListener('click', () => setMode('named'));
    btnNumeric.addEventListener('click', () => setMode('numeric'));
    btnHex.addEventListener('click', () => setMode('hex'));
    btnUnescape.addEventListener('click', () => setMode('unescape'));

    function process() {
        const val = entityInput.value;
        entityCount.innerText = `${val.length} character${val.length === 1 ? '' : 's'}`;

        if (!val) {
            entityOutput.value = '';
            return;
        }

        let out = '';
        if (currentMode === 'named') {
            out = val.replace(/[&<>"'©®™€£¥§°±×÷—–…•]/g, (ch) => NAMED_MAP[ch] || `&#${ch.charCodeAt(0)};`);
        } else if (currentMode === 'numeric') {
            out = val.replace(/[^\w\s]/g, (ch) => `&#${ch.codePointAt(0)};`);
        } else if (currentMode === 'hex') {
            out = val.replace(/[^\w\s]/g, (ch) => `&#x${ch.codePointAt(0).toString(16).toUpperCase()};`);
        } else if (currentMode === 'unescape') {
            const doc = new DOMParser().parseFromString(val, 'text/html');
            out = doc.documentElement.textContent || '';
        }

        entityOutput.value = out;
    }

    entityInput.addEventListener('input', process);

    copyEntityBtn.addEventListener('click', () => {
        if (!entityOutput.value) return;
        navigator.clipboard.writeText(entityOutput.value).then(() => {
            window.Atelier.showToast('Copied to clipboard!', 'success');
        });
    });

    clearBtn.addEventListener('click', () => {
        entityInput.value = '';
        process();
        entityInput.focus();
    });

    sampleBtn.addEventListener('click', () => {
        entityInput.value = `<div class="card">\n  <h2>Hello "World" & welcome!</h2>\n  <p>Copyright © 2026 Atelier™ • Price: €49.99</p>\n</div>`;
        setMode('named');
        window.Atelier.showToast('Sample HTML loaded!', 'info');
    });

    document.querySelectorAll('.insert-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const char = e.currentTarget.getAttribute('data-insert');
            entityInput.value += char;
            process();
            window.Atelier.showToast(`Inserted "${char}"`, 'info');
        });
    });
}
