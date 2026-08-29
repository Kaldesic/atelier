/* js/tools/jwt-secret-generator.js - Cryptographic Secret & Key Pair Generator */

export const html = `
<div class="tool-section" id="jwt-secret-generator-tool">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <div>
            <h1 class="tool-section-title" style="margin-bottom: 0.25rem;">JWT Secret & Key Generator</h1>
            <p style="color: var(--text-muted); font-size: 0.85rem;">Generate cryptographically secure JWT secrets, RSA/ECDSA key pairs, and high-entropy API tokens via Web Crypto API.</p>
        </div>
    </div>

    <!-- Mode Selector Tabs -->
    <div class="presets-bar" style="margin-bottom: 1.25rem;">
        <button class="preset-btn active" id="sec-tab-symmetric">Symmetric Secrets (HS256 / HS512)</button>
        <button class="preset-btn" id="sec-tab-asymmetric">Asymmetric Key Pairs (RSA / ECDSA)</button>
        <button class="preset-btn" id="sec-tab-apikey">API Keys & High-Entropy Tokens</button>
    </div>

    <!-- Panel 1: Symmetric JWT Secrets -->
    <div id="sec-panel-symmetric" class="sec-panel">
        <div class="controls-grid" style="grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin-bottom: 1.25rem; background: var(--bg); padding: 1rem; border-radius: 8px; border: 1px solid var(--border);">
            <div class="input-group" style="margin-bottom: 0;">
                <label class="input-label" for="sym-algorithm">Target Algorithm</label>
                <select id="sym-algorithm" class="select-field">
                    <option value="256" selected>HS256 (256-bit / 32 bytes)</option>
                    <option value="384">HS384 (384-bit / 48 bytes)</option>
                    <option value="512">HS512 (512-bit / 64 bytes)</option>
                    <option value="1024">Ultra 1024-bit (128 bytes)</option>
                </select>
            </div>
            <div class="input-group" style="margin-bottom: 0;">
                <label class="input-label" for="sym-encoding">Output Encoding</label>
                <select id="sym-encoding" class="select-field">
                    <option value="hex" selected>Hexadecimal (64 chars for 256-bit)</option>
                    <option value="base64">Base64</option>
                    <option value="base64url">Base64URL (URL-safe)</option>
                    <option value="utf8">Alphanumeric String + Symbols</option>
                </select>
            </div>
            <div class="input-group" style="margin-bottom: 0;">
                <label class="input-label" for="sym-batch-count">Batch Count</label>
                <select id="sym-batch-count" class="select-field">
                    <option value="1" selected>1 Secret</option>
                    <option value="5">5 Secrets</option>
                    <option value="10">10 Secrets</option>
                </select>
            </div>
        </div>

        <div style="display: flex; gap: 0.75rem; margin-bottom: 1.25rem;">
            <button class="btn btn-primary" id="sym-generate-btn" style="flex: 1;">Generate New Secret</button>
            <button class="btn btn-outline" id="sym-copy-all-btn">Copy Output</button>
        </div>

        <div class="input-group">
            <label for="sym-output" class="input-label">Generated Secret(s)</label>
            <textarea id="sym-output" class="textarea-field" readonly style="height: 180px; font-family: var(--font-mono); font-size: 0.9rem; line-height: 1.5; background: var(--bg);"></textarea>
        </div>
    </div>

    <!-- Panel 2: Asymmetric Key Pairs (RSA / ECDSA) -->
    <div id="sec-panel-asymmetric" class="sec-panel" style="display: none;">
        <div class="controls-grid" style="grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem; margin-bottom: 1.25rem; background: var(--bg); padding: 1rem; border-radius: 8px; border: 1px solid var(--border);">
            <div class="input-group" style="margin-bottom: 0;">
                <label class="input-label" for="asym-type">Key Pair Type</label>
                <select id="asym-type" class="select-field">
                    <option value="rsa-2048" selected>RSA 2048-bit (RS256)</option>
                    <option value="rsa-4096">RSA 4096-bit (RS512 - High Security)</option>
                    <option value="ecdsa-p256">ECDSA P-256 (ES256 - Fast & Compact)</option>
                    <option value="ecdsa-p384">ECDSA P-384 (ES384)</option>
                </select>
            </div>
            <div class="input-group" style="margin-bottom: 0;">
                <label class="input-label" for="asym-format">Format Output</label>
                <select id="asym-format" class="select-field">
                    <option value="pem" selected>Standard PEM (.pem / .key)</option>
                    <option value="jwk">JSON Web Key (JWK)</option>
                </select>
            </div>
        </div>

        <div style="margin-bottom: 1.25rem;">
            <button class="btn btn-primary" id="asym-generate-btn" style="width: 100%;">Generate Asymmetric Key Pair</button>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.25rem;" id="asym-split">
            <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                    <label for="asym-public-output" class="input-label" style="margin-bottom: 0; font-weight: 600;">Public Key (SPKI / Verify)</label>
                    <button class="btn btn-outline" id="asym-copy-pub" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;">Copy Public</button>
                </div>
                <textarea id="asym-public-output" class="textarea-field" readonly style="height: 240px; font-family: var(--font-mono); font-size: 0.75rem; background: var(--bg);"></textarea>
            </div>
            <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                    <label for="asym-private-output" class="input-label" style="margin-bottom: 0; font-weight: 600; color: var(--warning);">Private Key (PKCS#8 / Sign)</label>
                    <button class="btn btn-outline" id="asym-copy-priv" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;">Copy Private</button>
                </div>
                <textarea id="asym-private-output" class="textarea-field" readonly style="height: 240px; font-family: var(--font-mono); font-size: 0.75rem; background: var(--bg);"></textarea>
            </div>
        </div>
    </div>

    <!-- Panel 3: API Keys & Tokens -->
    <div id="sec-panel-apikey" class="sec-panel" style="display: none;">
        <div class="controls-grid" style="grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; margin-bottom: 1.25rem; background: var(--bg); padding: 1rem; border-radius: 8px; border: 1px solid var(--border);">
            <div class="input-group" style="margin-bottom: 0;">
                <label class="input-label" for="token-preset">Token Preset</label>
                <select id="token-preset" class="select-field">
                    <option value="prefix_sk">sk_live_... (Stripe/OpenAI style)</option>
                    <option value="hex_64">Webhook Secret (64 hex)</option>
                    <option value="nanoid">NanoID (21 chars)</option>
                    <option value="custom" selected>Custom Length Token</option>
                </select>
            </div>
            <div class="input-group" style="margin-bottom: 0;">
                <label class="input-label" for="token-length">Length: <span id="token-len-display">32</span></label>
                <input type="range" id="token-length" min="16" max="128" value="32" class="input-field" style="padding: 0; cursor: pointer;">
            </div>
            <div class="input-group" style="margin-bottom: 0;">
                <label class="input-label" for="token-prefix">Optional Prefix</label>
                <input type="text" id="token-prefix" class="input-field" placeholder="e.g. atel_sec_">
            </div>
        </div>

        <div style="display: flex; gap: 0.75rem; margin-bottom: 1.25rem;">
            <button class="btn btn-primary" id="token-generate-btn" style="flex: 1;">Generate API Key</button>
            <button class="btn btn-outline" id="token-copy-btn">Copy Key</button>
        </div>

        <div class="input-group">
            <label for="token-output" class="input-label">Generated Key</label>
            <input type="text" id="token-output" class="input-field" readonly style="font-family: var(--font-mono); font-size: 0.95rem; background: var(--bg); padding: 0.8rem;">
        </div>
    </div>

    <!-- Security & Entropy Meter -->
    <div id="sec-entropy-card" style="background: var(--card-bg); border: 1px solid var(--border); border-radius: 8px; padding: 1rem; margin-top: 1.25rem;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
            <div style="font-size: 0.85rem; font-weight: 600;">Entropy & Cryptographic Strength</div>
            <span id="sec-strength-badge" style="font-size: 0.75rem; padding: 2px 8px; border-radius: 12px; background: rgba(52, 211, 153, 0.15); color: var(--success); font-weight: 600;">Optimal (256-bit)</span>
        </div>
        <div style="width: 100%; height: 6px; background: var(--border); border-radius: 3px; overflow: hidden; margin-bottom: 0.5rem;">
            <div id="sec-strength-bar" style="width: 100%; height: 100%; background: var(--success); transition: width 0.3s ease;"></div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.75rem; color: var(--text-muted);">
            <span>Zero Server Transmission • 100% In-RAM CSPRNG</span>
            <span id="sec-entropy-score">Entropy: ~256 bits (Uncrackable by brute force)</span>
        </div>
    </div>
</div>
`;

export function init() {
    // Tabs
    const tabSym = document.getElementById('sec-tab-symmetric');
    const tabAsym = document.getElementById('sec-tab-asymmetric');
    const tabApiKey = document.getElementById('sec-tab-apikey');

    const panelSym = document.getElementById('sec-panel-symmetric');
    const panelAsym = document.getElementById('sec-panel-asymmetric');
    const panelApiKey = document.getElementById('sec-panel-apikey');

    function switchTab(activeTab, activePanel) {
        [tabSym, tabAsym, tabApiKey].forEach(t => t.classList.remove('active'));
        [panelSym, panelAsym, panelApiKey].forEach(p => p.style.display = 'none');
        activeTab.classList.add('active');
        activePanel.style.display = 'block';
    }

    tabSym.addEventListener('click', () => switchTab(tabSym, panelSym));
    tabAsym.addEventListener('click', () => switchTab(tabAsym, panelAsym));
    tabApiKey.addEventListener('click', () => switchTab(tabApiKey, panelApiKey));

    // Symmetric Generator
    const symAlgo = document.getElementById('sym-algorithm');
    const symEncoding = document.getElementById('sym-encoding');
    const symBatch = document.getElementById('sym-batch-count');
    const symGenerateBtn = document.getElementById('sym-generate-btn');
    const symCopyAllBtn = document.getElementById('sym-copy-all-btn');
    const symOutput = document.getElementById('sym-output');

    function arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.byteLength; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    }

    function arrayBufferToHex(buffer) {
        return Array.from(new Uint8Array(buffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    function generateSymmetricSecret() {
        const bits = parseInt(symAlgo.value, 10);
        const bytesCount = bits / 8;
        const encoding = symEncoding.value;
        const count = parseInt(symBatch.value, 10);

        const results = [];

        for (let k = 0; k < count; k++) {
            const randomBytes = new Uint8Array(bytesCount);
            window.crypto.getRandomValues(randomBytes);

            if (encoding === 'hex') {
                results.push(arrayBufferToHex(randomBytes));
            } else if (encoding === 'base64') {
                results.push(arrayBufferToBase64(randomBytes));
            } else if (encoding === 'base64url') {
                results.push(arrayBufferToBase64(randomBytes).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, ''));
            } else {
                // Alphanumeric + safe symbols
                const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()-_=+[]{}<>';
                let str = '';
                for (let i = 0; i < bytesCount; i++) {
                    str += chars.charAt(randomBytes[i] % chars.length);
                }
                results.push(str);
            }
        }

        symOutput.value = results.join('\n');
    }

    symGenerateBtn.addEventListener('click', generateSymmetricSecret);
    symAlgo.addEventListener('change', generateSymmetricSecret);
    symEncoding.addEventListener('change', generateSymmetricSecret);
    symBatch.addEventListener('change', generateSymmetricSecret);
    symCopyAllBtn.addEventListener('click', () => Atelier.copyToClipboard(symOutput.value, 'Secret(s) copied to clipboard!'));

    // Asymmetric RSA & ECDSA Key Generator
    const asymType = document.getElementById('asym-type');
    const asymFormat = document.getElementById('asym-format');
    const asymGenerateBtn = document.getElementById('asym-generate-btn');
    const asymPubOutput = document.getElementById('asym-public-output');
    const asymPrivOutput = document.getElementById('asym-private-output');
    const asymCopyPub = document.getElementById('asym-copy-pub');
    const asymCopyPriv = document.getElementById('asym-copy-priv');

    function wrapPEM(b64, label) {
        let pem = `-----BEGIN ${label}-----\n`;
        for (let i = 0; i < b64.length; i += 64) {
            pem += b64.slice(i, i + 64) + '\n';
        }
        pem += `-----END ${label}-----`;
        return pem;
    }

    async function generateAsymmetricKeys() {
        asymGenerateBtn.disabled = true;
        asymGenerateBtn.textContent = 'Generating Cryptographic Key Pair...';
        const type = asymType.value;
        const format = asymFormat.value;

        try {
            let keyPair;

            if (type.startsWith('rsa')) {
                const modulusLength = type === 'rsa-4096' ? 4096 : 2048;
                keyPair = await window.crypto.subtle.generateKey(
                    {
                        name: 'RSASSA-PKCS1-v1_5',
                        modulusLength,
                        publicExponent: new Uint8Array([1, 0, 1]),
                        hash: 'SHA-256'
                    },
                    true,
                    ['sign', 'verify']
                );
            } else {
                const namedCurve = type === 'ecdsa-p384' ? 'P-384' : 'P-256';
                keyPair = await window.crypto.subtle.generateKey(
                    {
                        name: 'ECDSA',
                        namedCurve
                    },
                    true,
                    ['sign', 'verify']
                );
            }

            if (format === 'jwk') {
                const pubJwk = await window.crypto.subtle.exportKey('jwk', keyPair.publicKey);
                const privJwk = await window.crypto.subtle.exportKey('jwk', keyPair.privateKey);
                asymPubOutput.value = JSON.stringify(pubJwk, null, 2);
                asymPrivOutput.value = JSON.stringify(privJwk, null, 2);
            } else {
                const pubSpki = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
                const privPkcs8 = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
                asymPubOutput.value = wrapPEM(arrayBufferToBase64(pubSpki), 'PUBLIC KEY');
                asymPrivOutput.value = wrapPEM(arrayBufferToBase64(privPkcs8), 'PRIVATE KEY');
            }

            Atelier.showToast('Key pair generated successfully', 'success');
        } catch (err) {
            console.error('Key gen failed:', err);
            Atelier.showToast('Key generation error: ' + err.message, 'error');
        } finally {
            asymGenerateBtn.disabled = false;
            asymGenerateBtn.textContent = 'Generate Asymmetric Key Pair';
        }
    }

    asymGenerateBtn.addEventListener('click', generateAsymmetricKeys);
    asymCopyPub.addEventListener('click', () => Atelier.copyToClipboard(asymPubOutput.value, 'Public key copied!'));
    asymCopyPriv.addEventListener('click', () => Atelier.copyToClipboard(asymPrivOutput.value, 'Private key copied!'));

    // API Key / Token Generator
    const tokenPreset = document.getElementById('token-preset');
    const tokenLength = document.getElementById('token-length');
    const tokenLenDisplay = document.getElementById('token-len-display');
    const tokenPrefix = document.getElementById('token-prefix');
    const tokenGenerateBtn = document.getElementById('token-generate-btn');
    const tokenCopyBtn = document.getElementById('token-copy-btn');
    const tokenOutput = document.getElementById('token-output');

    tokenLength.addEventListener('input', (e) => {
        tokenLenDisplay.textContent = e.target.value;
    });

    tokenPreset.addEventListener('change', () => {
        if (tokenPreset.value === 'prefix_sk') {
            tokenPrefix.value = 'sk_live_';
            tokenLength.value = 48;
        } else if (tokenPreset.value === 'hex_64') {
            tokenPrefix.value = 'whsec_';
            tokenLength.value = 64;
        } else if (tokenPreset.value === 'nanoid') {
            tokenPrefix.value = '';
            tokenLength.value = 21;
        }
        tokenLenDisplay.textContent = tokenLength.value;
        generateApiKey();
    });

    function generateApiKey() {
        const len = parseInt(tokenLength.value, 10);
        const prefix = tokenPrefix.value.trim();
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        const rand = new Uint8Array(len);
        window.crypto.getRandomValues(rand);

        let key = prefix;
        for (let i = 0; i < len; i++) {
            key += chars.charAt(rand[i] % chars.length);
        }
        tokenOutput.value = key;
    }

    tokenGenerateBtn.addEventListener('click', generateApiKey);
    tokenCopyBtn.addEventListener('click', () => Atelier.copyToClipboard(tokenOutput.value, 'API Key copied to clipboard!'));

    // Initial runs
    generateSymmetricSecret();
    generateApiKey();
}
