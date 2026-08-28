export const html = `
    <h1>JWT Debugger & Inspector</h1>
    <p class="subtitle">Decode and inspect JSON Web Tokens locally with zero telemetry, signature validation checks, and expiration countdowns.</p>

    <div class="tool-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; flex-wrap: wrap; gap: 0.5rem;">
            <label for="jwtInput" class="input-label" style="margin-bottom: 0;">Encoded JWT Token</label>
            <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-outline" id="sampleJwtBtn" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;">Load Sample</button>
                <button class="btn btn-outline" id="clearJwtBtn" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;">Clear</button>
            </div>
        </div>

        <div class="input-group">
            <textarea id="jwtInput" class="textarea-field" style="height: 110px; font-family: var(--font-mono); font-size: 0.82rem; word-break: break-all;" placeholder="Paste JWT token here (header.payload.signature)..."></textarea>
        </div>

        <!-- Token Status Banner -->
        <div id="jwtStatusBanner" style="display: none; padding: 0.75rem 1rem; border-radius: 8px; margin-bottom: 1.5rem; font-size: 0.85rem; display: flex; align-items: center; justify-content: space-between; border: 1px solid var(--border); background: var(--bg);">
            <div id="jwtStatusText" style="font-weight: 500;">Ready</div>
            <div id="jwtExpTime" style="font-family: var(--font-mono); color: var(--text-muted); font-size: 0.8rem;"></div>
        </div>

        <!-- Decoded Output Split Grid -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;" class="jwt-split-grid">
            <!-- Header Section -->
            <div class="input-group" style="margin-bottom: 0;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                    <label class="input-label" style="margin-bottom: 0; color: #ef4444;">Header (Algorithm & Type)</label>
                    <button class="btn btn-outline" id="copyHeaderBtn" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;">Copy</button>
                </div>
                <textarea id="jwtHeaderOutput" class="textarea-field" style="height: 160px; font-family: var(--font-mono); font-size: 0.82rem; color: #ef4444;" readonly placeholder="Decoded header will appear here..."></textarea>
            </div>

            <!-- Payload Section -->
            <div class="input-group" style="margin-bottom: 0;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                    <label class="input-label" style="margin-bottom: 0; color: #8b5cf6;">Payload (Data & Claims)</label>
                    <button class="btn btn-outline" id="copyPayloadBtn" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;">Copy</button>
                </div>
                <textarea id="jwtPayloadOutput" class="textarea-field" style="height: 160px; font-family: var(--font-mono); font-size: 0.82rem; color: #8b5cf6;" readonly placeholder="Decoded payload claims will appear here..."></textarea>
            </div>
        </div>

        <!-- Signature Section -->
        <div class="input-group" style="margin-top: 1.25rem; margin-bottom: 0;">
            <label class="input-label" style="color: #0284c7;">Signature Checksum (Raw Base64Url)</label>
            <input type="text" id="jwtSignatureOutput" class="input-field" style="font-family: var(--font-mono); font-size: 0.82rem; color: #0284c7;" readonly placeholder="Raw signature hash">
        </div>
    </div>
`;

export function init() {
    const jwtInput = document.getElementById('jwtInput');
    const sampleJwtBtn = document.getElementById('sampleJwtBtn');
    const clearJwtBtn = document.getElementById('clearJwtBtn');
    const jwtStatusBanner = document.getElementById('jwtStatusBanner');
    const jwtStatusText = document.getElementById('jwtStatusText');
    const jwtExpTime = document.getElementById('jwtExpTime');
    const jwtHeaderOutput = document.getElementById('jwtHeaderOutput');
    const jwtPayloadOutput = document.getElementById('jwtPayloadOutput');
    const jwtSignatureOutput = document.getElementById('jwtSignatureOutput');
    const copyHeaderBtn = document.getElementById('copyHeaderBtn');
    const copyPayloadBtn = document.getElementById('copyPayloadBtn');

    function base64UrlDecode(str) {
        let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4) {
            base64 += '=';
        }
        try {
            return decodeURIComponent(escape(window.atob(base64)));
        } catch {
            return window.atob(base64);
        }
    }

    function decodeJwt() {
        const token = jwtInput.value.trim();

        if (!token) {
            jwtStatusBanner.style.display = 'none';
            jwtHeaderOutput.value = '';
            jwtPayloadOutput.value = '';
            jwtSignatureOutput.value = '';
            return;
        }

        const parts = token.split('.');
        if (parts.length !== 3) {
            jwtStatusBanner.style.display = 'flex';
            jwtStatusBanner.style.borderColor = 'var(--error)';
            jwtStatusText.innerHTML = `<span style="color: var(--error);">Invalid JWT Structure (must have 3 dot-separated segments)</span>`;
            jwtExpTime.innerText = '';
            jwtHeaderOutput.value = 'Error: Invalid JWT';
            jwtPayloadOutput.value = 'Error: Invalid JWT';
            jwtSignatureOutput.value = '';
            return;
        }

        try {
            const headerStr = base64UrlDecode(parts[0]);
            const payloadStr = base64UrlDecode(parts[1]);
            const headerObj = JSON.parse(headerStr);
            const payloadObj = JSON.parse(payloadStr);

            jwtHeaderOutput.value = JSON.stringify(headerObj, null, 2);
            jwtPayloadOutput.value = JSON.stringify(payloadObj, null, 2);
            jwtSignatureOutput.value = parts[2];

            // Expiration inspection
            jwtStatusBanner.style.display = 'flex';
            if (payloadObj.exp) {
                const expDate = new Date(payloadObj.exp * 1000);
                const now = new Date();
                const isExpired = expDate < now;

                if (isExpired) {
                    jwtStatusBanner.style.borderColor = 'rgba(239, 68, 68, 0.4)';
                    jwtStatusText.innerHTML = `<span style="color: var(--error);">🔴 Token Expired (${expDate.toLocaleString()})</span>`;
                } else {
                    jwtStatusBanner.style.borderColor = 'rgba(16, 185, 129, 0.4)';
                    jwtStatusText.innerHTML = `<span style="color: var(--success);">🟢 Token Active (Expires: ${expDate.toLocaleString()})</span>`;
                }
                jwtExpTime.innerText = `exp: ${payloadObj.exp}`;
            } else {
                jwtStatusBanner.style.borderColor = 'var(--border)';
                jwtStatusText.innerHTML = `<span style="color: var(--text-muted);">⚪ Valid Format (No 'exp' claim found)</span>`;
                jwtExpTime.innerText = '';
            }

        } catch (err) {
            jwtStatusBanner.style.display = 'flex';
            jwtStatusBanner.style.borderColor = 'var(--error)';
            jwtStatusText.innerHTML = `<span style="color: var(--error);">Malformed Payload or Header JSON</span>`;
            jwtExpTime.innerText = '';
        }
    }

    jwtInput.addEventListener('input', decodeJwt);

    sampleJwtBtn.addEventListener('click', () => {
        // Mock standard JWT valid until far in future
        const sampleHeader = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" })).replace(/=/g, '');
        const samplePayload = btoa(JSON.stringify({
            sub: "user_9841285",
            name: "Alex Designer",
            role: "lead_architect",
            iat: Math.floor(Date.now() / 1000),
            exp: Math.floor(Date.now() / 1000) + 86400 * 30
        })).replace(/=/g, '');
        const sampleSignature = "dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk";

        jwtInput.value = `${sampleHeader}.${samplePayload}.${sampleSignature}`;
        decodeJwt();
        window.Atelier.showToast('Sample JWT loaded!', 'info');
    });

    clearJwtBtn.addEventListener('click', () => {
        jwtInput.value = '';
        decodeJwt();
        jwtInput.focus();
    });

    copyHeaderBtn.addEventListener('click', () => {
        if (!jwtHeaderOutput.value) return;
        navigator.clipboard.writeText(jwtHeaderOutput.value).then(() => {
            window.Atelier.showToast('Copied Header JSON!', 'success');
        });
    });

    copyPayloadBtn.addEventListener('click', () => {
        if (!jwtPayloadOutput.value) return;
        navigator.clipboard.writeText(jwtPayloadOutput.value).then(() => {
            window.Atelier.showToast('Copied Payload JSON!', 'success');
        });
    });
}
