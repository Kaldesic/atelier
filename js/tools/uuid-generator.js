export const html = `
    <h1>UUID & Cryptographic Token Generator</h1>
    <p class="subtitle">Generate RFC4122 compliant UUIDs (v4), NanoIDs, URL-safe random secrets, and API tokens client-side.</p>

    <div class="tool-section">
        <div class="presets-bar" style="margin-bottom: 1.5rem;">
            <button class="preset-btn active" id="type-uuid">UUID v4</button>
            <button class="preset-btn" id="type-nanoid">NanoID (Compact)</button>
            <button class="preset-btn" id="type-hex">Hex / Hash Secret</button>
            <button class="preset-btn" id="type-alphanumeric">Alphanumeric Token</button>
            <button class="preset-btn" id="type-passphrase">Memorable Passphrase</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
            <div class="input-group" style="margin-bottom: 0;">
                <label for="quantitySelect" class="input-label">Quantity</label>
                <select id="quantitySelect" class="input-field" style="height: 42px;">
                    <option value="1">1 ID</option>
                    <option value="5" selected>5 IDs</option>
                    <option value="10">10 IDs</option>
                    <option value="25">25 IDs</option>
                    <option value="50">50 IDs</option>
                </select>
            </div>

            <div class="input-group" id="lengthGroup" style="margin-bottom: 0;">
                <label for="tokenLength" class="input-label">Length (Chars)</label>
                <input type="number" id="tokenLength" class="input-field" value="21" min="6" max="128" style="height: 42px;">
            </div>

            <div class="input-group" style="margin-bottom: 0;">
                <label for="casingSelect" class="input-label">Casing / Format</label>
                <select id="casingSelect" class="input-field" style="height: 42px;">
                    <option value="lowercase">Lowercase</option>
                    <option value="uppercase">Uppercase</option>
                    <option value="no-hyphens">Without Hyphens</option>
                </select>
            </div>
        </div>

        <div style="display: flex; gap: 0.75rem; margin-bottom: 1.5rem;">
            <button class="btn btn-primary" id="generateBtn" style="padding: 0.55rem 1.25rem;">⚡ Generate Fresh IDs</button>
            <button class="btn btn-outline" id="copyAllBtn" style="padding: 0.55rem 1.25rem;">Copy All</button>
        </div>

        <div class="input-group" style="margin-bottom: 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                <label class="input-label" style="margin-bottom: 0;">Generated Output</label>
                <span id="outputMeta" class="result-meta">5 items generated</span>
            </div>
            <textarea id="tokenOutput" class="textarea-field" style="height: 220px; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.6;" readonly></textarea>
        </div>
    </div>
`;

export function init() {
    const typeUuid = document.getElementById('type-uuid');
    const typeNanoid = document.getElementById('type-nanoid');
    const typeHex = document.getElementById('type-hex');
    const typeAlphanumeric = document.getElementById('type-alphanumeric');
    const typePassphrase = document.getElementById('type-passphrase');
    const typeButtons = [typeUuid, typeNanoid, typeHex, typeAlphanumeric, typePassphrase];

    const quantitySelect = document.getElementById('quantitySelect');
    const tokenLength = document.getElementById('tokenLength');
    const lengthGroup = document.getElementById('lengthGroup');
    const casingSelect = document.getElementById('casingSelect');
    const generateBtn = document.getElementById('generateBtn');
    const copyAllBtn = document.getElementById('copyAllBtn');
    const tokenOutput = document.getElementById('tokenOutput');
    const outputMeta = document.getElementById('outputMeta');

    let currentType = 'uuid';

    const WORDS = ['shadow', 'crystal', 'quantum', 'forest', 'matrix', 'velvet', 'orbit', 'cyber', 'aurora', 'beacon', 'ember', 'gravity', 'nexus', 'pulse', 'zenith', 'prism', 'vortex', 'symphony', 'titan', 'stellar', 'cascade', 'monolith', 'cobalt', 'silver', 'phoenix', 'solstice', 'horizon', 'nebula', 'glacier', 'mirage'];

    function setType(type, btn) {
        currentType = type;
        typeButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (type === 'uuid' || type === 'passphrase') {
            lengthGroup.style.opacity = '0.5';
            tokenLength.disabled = true;
        } else {
            lengthGroup.style.opacity = '1';
            tokenLength.disabled = false;
        }

        generate();
    }

    typeUuid.addEventListener('click', () => setType('uuid', typeUuid));
    typeNanoid.addEventListener('click', () => setType('nanoid', typeNanoid));
    typeHex.addEventListener('click', () => setType('hex', typeHex));
    typeAlphanumeric.addEventListener('click', () => setType('alphanumeric', typeAlphanumeric));
    typePassphrase.addEventListener('click', () => setType('passphrase', typePassphrase));

    function getRandomCryptoValues(length) {
        const arr = new Uint8Array(length);
        window.crypto.getRandomValues(arr);
        return arr;
    }

    function generateSingleItem() {
        const len = parseInt(tokenLength.value, 10) || 21;
        const casing = casingSelect.value;

        if (currentType === 'uuid') {
            let u = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                const r = window.crypto.getRandomValues(new Uint8Array(1))[0] % 16;
                const v = c === 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
            if (casing === 'uppercase') u = u.toUpperCase();
            if (casing === 'no-hyphens') u = u.replace(/-/g, '');
            return u;
        }

        if (currentType === 'nanoid') {
            const chars = 'useandom-26T1983_40XYZabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
            const bytes = getRandomCryptoValues(len);
            let res = '';
            for (let i = 0; i < len; i++) {
                res += chars[bytes[i] % chars.length];
            }
            if (casing === 'uppercase') res = res.toUpperCase();
            if (casing === 'lowercase') res = res.toLowerCase();
            return res;
        }

        if (currentType === 'hex') {
            const bytes = getRandomCryptoValues(Math.ceil(len / 2));
            let res = Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('').slice(0, len);
            if (casing === 'uppercase') res = res.toUpperCase();
            return res;
        }

        if (currentType === 'alphanumeric') {
            const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            const bytes = getRandomCryptoValues(len);
            let res = '';
            for (let i = 0; i < len; i++) {
                res += chars[bytes[i] % chars.length];
            }
            if (casing === 'uppercase') res = res.toUpperCase();
            if (casing === 'lowercase') res = res.toLowerCase();
            return res;
        }

        if (currentType === 'passphrase') {
            const bytes = getRandomCryptoValues(4);
            const selected = [
                WORDS[bytes[0] % WORDS.length],
                WORDS[bytes[1] % WORDS.length],
                WORDS[bytes[2] % WORDS.length],
                (bytes[3] % 899 + 100).toString()
            ];
            let res = selected.join('-');
            if (casing === 'uppercase') res = res.toUpperCase();
            if (casing === 'no-hyphens') res = selected.join('');
            return res;
        }

        return '';
    }

    function generate() {
        const qty = parseInt(quantitySelect.value, 10) || 5;
        const results = [];
        for (let i = 0; i < qty; i++) {
            results.push(generateSingleItem());
        }

        tokenOutput.value = results.join('\n');
        outputMeta.innerText = `${qty} item${qty === 1 ? '' : 's'} generated`;
    }

    generateBtn.addEventListener('click', () => {
        generate();
        window.Atelier.showToast('Generated fresh keys!', 'info');
    });

    [quantitySelect, tokenLength, casingSelect].forEach(el => {
        el.addEventListener('change', generate);
    });

    copyAllBtn.addEventListener('click', () => {
        if (!tokenOutput.value) return;
        navigator.clipboard.writeText(tokenOutput.value).then(() => {
            window.Atelier.showToast('Copied all IDs to clipboard!', 'success');
        });
    });

    generate();
}
