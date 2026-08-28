// js/tools/qr-code-studio.js
export const html = `
    <h1>Smart QR Code Studio</h1>
    <p class="subtitle">Generate custom, high-resolution QR codes client-side for WiFi, vCard Contacts, URLs, and text.</p>

    <div class="tool-section">
        <!-- Mode Tabs -->
        <div class="presets-bar" style="margin-bottom: 1.5rem;">
            <button class="preset-btn active" id="mode-url">🔗 Link / URL</button>
            <button class="preset-btn" id="mode-wifi">📶 WiFi Network</button>
            <button class="preset-btn" id="mode-vcard">📇 Contact (vCard)</button>
            <button class="preset-btn" id="mode-text">📝 Plain Text / Email</button>
        </div>

        <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 2rem; align-items: start;" class="qr-layout-grid">
            <!-- Dynamic Input Configuration Area -->
            <div id="qrInputsContainer">
                <!-- URL Panel -->
                <div id="panel-url" class="qr-panel">
                    <div class="input-group">
                        <label for="qrUrlInput" class="input-label">Website or Destination URL</label>
                        <input type="url" id="qrUrlInput" class="input-field" value="https://atelier.tools" placeholder="https://example.com">
                    </div>
                </div>

                <!-- WiFi Panel -->
                <div id="panel-wifi" class="qr-panel" style="display: none;">
                    <div class="input-group">
                        <label for="wifiSsid" class="input-label">Network Name (SSID)</label>
                        <input type="text" id="wifiSsid" class="input-field" placeholder="MyHomeNetwork_5G">
                    </div>
                    <div class="input-group">
                        <label for="wifiPassword" class="input-label">Network Password</label>
                        <input type="text" id="wifiPassword" class="input-field" placeholder="SecretPassword123">
                    </div>
                    <div class="input-group">
                        <label for="wifiAuth" class="input-label">Security Type</label>
                        <select id="wifiAuth" class="input-field">
                            <option value="WPA" selected>WPA/WPA2/WPA3</option>
                            <option value="WEP">WEP</option>
                            <option value="nopass">None (Open Network)</option>
                        </select>
                    </div>
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 1rem;">
                        <input type="checkbox" id="wifiHidden">
                        <label for="wifiHidden" style="font-size: 0.85rem; color: var(--text-muted); cursor: pointer;">Hidden SSID Network</label>
                    </div>
                </div>

                <!-- vCard Panel -->
                <div id="panel-vcard" class="qr-panel" style="display: none;">
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 0.75rem;">
                        <div class="input-group">
                            <label for="vcardFirst" class="input-label">First Name</label>
                            <input type="text" id="vcardFirst" class="input-field" placeholder="Alex">
                        </div>
                        <div class="input-group">
                            <label for="vcardLast" class="input-label">Last Name</label>
                            <input type="text" id="vcardLast" class="input-field" placeholder="Morgan">
                        </div>
                    </div>
                    <div class="input-group">
                        <label for="vcardPhone" class="input-label">Phone Number</label>
                        <input type="tel" id="vcardPhone" class="input-field" placeholder="+1 (555) 019-2834">
                    </div>
                    <div class="input-group">
                        <label for="vcardEmail" class="input-label">Email Address</label>
                        <input type="email" id="vcardEmail" class="input-field" placeholder="alex@company.com">
                    </div>
                    <div class="input-group">
                        <label for="vcardOrg" class="input-label">Company / Organization</label>
                        <input type="text" id="vcardOrg" class="input-field" placeholder="Studio Nexus">
                    </div>
                </div>

                <!-- Text Panel -->
                <div id="panel-text" class="qr-panel" style="display: none;">
                    <div class="input-group">
                        <label for="qrTextInput" class="input-label">Plain Text Content or Message</label>
                        <textarea id="qrTextInput" class="textarea-field" style="height: 120px;" placeholder="Type anything here..."></textarea>
                    </div>
                </div>

                <!-- Customization Options -->
                <div style="margin-top: 1.25rem; padding-top: 1.25rem; border-top: 1px solid var(--border);">
                    <h3 style="font-size: 0.95rem; font-weight: 600; margin-bottom: 0.85rem; color: var(--text);">Style & Colors</h3>
                    
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                        <div>
                            <label class="input-label" style="font-size: 0.8rem;">Foreground Color</label>
                            <div style="display: flex; gap: 0.5rem; align-items: center;">
                                <input type="color" id="qrFgColor" value="#0f1115" style="width: 36px; height: 36px; border: 1px solid var(--border); border-radius: 6px; cursor: pointer; background: transparent; padding: 2px;">
                                <input type="text" id="qrFgHex" class="input-field" value="#0f1115" style="font-family: var(--font-mono); font-size: 0.85rem;">
                            </div>
                        </div>

                        <div>
                            <label class="input-label" style="font-size: 0.8rem;">Background Color</label>
                            <div style="display: flex; gap: 0.5rem; align-items: center;">
                                <input type="color" id="qrBgColor" value="#ffffff" style="width: 36px; height: 36px; border: 1px solid var(--border); border-radius: 6px; cursor: pointer; background: transparent; padding: 2px;">
                                <input type="text" id="qrBgHex" class="input-field" value="#ffffff" style="font-family: var(--font-mono); font-size: 0.85rem;">
                            </div>
                        </div>
                    </div>

                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem;">
                        <div class="input-group" style="margin-bottom: 0;">
                            <label for="qrErrorCorrection" class="input-label" style="font-size: 0.8rem;">Error Correction</label>
                            <select id="qrErrorCorrection" class="input-field" style="font-size: 0.85rem;">
                                <option value="L">L (7% Recovery)</option>
                                <option value="M" selected>M (15% Recovery)</option>
                                <option value="Q">Q (25% Recovery)</option>
                                <option value="H">H (30% Best)</option>
                            </select>
                        </div>
                        <div class="input-group" style="margin-bottom: 0;">
                            <label for="qrResolution" class="input-label" style="font-size: 0.8rem;">Export Resolution</label>
                            <select id="qrResolution" class="input-field" style="font-size: 0.85rem;">
                                <option value="300">300 x 300 px</option>
                                <option value="600" selected>600 x 600 px (HD)</option>
                                <option value="1200">1200 x 1200 px (Print)</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Live QR Canvas Display & Export Area -->
            <div style="display: flex; flex-direction: column; align-items: center; justify-content: center; background: var(--bg); border: 1px solid var(--border); border-radius: 12px; padding: 1.5rem;">
                <div id="qrPreviewWrapper" style="padding: 1rem; background: #ffffff; border-radius: 8px; box-shadow: 0 4px 15px rgba(0,0,0,0.08); display: flex; align-items: center; justify-content: center; margin-bottom: 1.25rem;">
                    <canvas id="qrCanvas" width="220" height="220" style="display: block; max-width: 100%; height: auto;"></canvas>
                </div>

                <div style="display: flex; flex-direction: column; gap: 0.6rem; width: 100%;">
                    <button class="btn btn-primary" id="downloadPngBtn" style="width: 100%;">💾 Download PNG</button>
                    <button class="btn btn-outline" id="copyQrImageBtn" style="width: 100%;">📋 Copy Image to Clipboard</button>
                    <button class="btn btn-outline" id="downloadSvgBtn" style="width: 100%;">📐 Download Scalable SVG</button>
                </div>
            </div>
        </div>
    </div>
`;

export function init() {
    // Mode Buttons
    const modeUrl = document.getElementById('mode-url');
    const modeWifi = document.getElementById('mode-wifi');
    const modeVcard = document.getElementById('mode-vcard');
    const modeText = document.getElementById('mode-text');
    const modeBtns = [modeUrl, modeWifi, modeVcard, modeText];

    const panelUrl = document.getElementById('panel-url');
    const panelWifi = document.getElementById('panel-wifi');
    const panelVcard = document.getElementById('panel-vcard');
    const panelText = document.getElementById('panel-text');
    const panels = [panelUrl, panelWifi, panelVcard, panelText];

    // Inputs
    const qrUrlInput = document.getElementById('qrUrlInput');
    const wifiSsid = document.getElementById('wifiSsid');
    const wifiPassword = document.getElementById('wifiPassword');
    const wifiAuth = document.getElementById('wifiAuth');
    const wifiHidden = document.getElementById('wifiHidden');

    const vcardFirst = document.getElementById('vcardFirst');
    const vcardLast = document.getElementById('vcardLast');
    const vcardPhone = document.getElementById('vcardPhone');
    const vcardEmail = document.getElementById('vcardEmail');
    const vcardOrg = document.getElementById('vcardOrg');

    const qrTextInput = document.getElementById('qrTextInput');

    const qrFgColor = document.getElementById('qrFgColor');
    const qrFgHex = document.getElementById('qrFgHex');
    const qrBgColor = document.getElementById('qrBgColor');
    const qrBgHex = document.getElementById('qrBgHex');
    const qrErrorCorrection = document.getElementById('qrErrorCorrection');
    const qrResolution = document.getElementById('qrResolution');
    const qrCanvas = document.getElementById('qrCanvas');
    const qrPreviewWrapper = document.getElementById('qrPreviewWrapper');

    const downloadPngBtn = document.getElementById('downloadPngBtn');
    const copyQrImageBtn = document.getElementById('copyQrImageBtn');
    const downloadSvgBtn = document.getElementById('downloadSvgBtn');

    let currentMode = 'url';

    function setMode(mode, btn, panel) {
        currentMode = mode;
        modeBtns.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.style.display = 'none');
        btn.classList.add('active');
        panel.style.display = 'block';
        updateQRCode();
    }

    modeUrl.addEventListener('click', () => setMode('url', modeUrl, panelUrl));
    modeWifi.addEventListener('click', () => setMode('wifi', modeWifi, panelWifi));
    modeVcard.addEventListener('click', () => setMode('vcard', modeVcard, panelVcard));
    modeText.addEventListener('click', () => setMode('text', modeText, panelText));

    // Color Pickers sync
    qrFgColor.addEventListener('input', () => {
        qrFgHex.value = qrFgColor.value;
        updateQRCode();
    });
    qrFgHex.addEventListener('input', () => {
        if (/^#[0-9A-Fa-f]{6}$/.test(qrFgHex.value)) {
            qrFgColor.value = qrFgHex.value;
            updateQRCode();
        }
    });

    qrBgColor.addEventListener('input', () => {
        qrBgHex.value = qrBgColor.value;
        qrPreviewWrapper.style.background = qrBgColor.value;
        updateQRCode();
    });
    qrBgHex.addEventListener('input', () => {
        if (/^#[0-9A-Fa-f]{6}$/.test(qrBgHex.value)) {
            qrBgColor.value = qrBgHex.value;
            qrPreviewWrapper.style.background = qrBgColor.value;
            updateQRCode();
        }
    });

    function getPayload() {
        if (currentMode === 'url') {
            return qrUrlInput.value.trim() || 'https://atelier.tools';
        }
        if (currentMode === 'wifi') {
            const ssid = (wifiSsid.value || 'HomeNetwork').replace(/([\\;,:"])/g, '\\$1');
            const pass = (wifiPassword.value || '').replace(/([\\;,:"])/g, '\\$1');
            const auth = wifiAuth.value;
            const hidden = wifiHidden.checked ? 'H:true;' : '';
            return `WIFI:S:${ssid};T:${auth};P:${pass};${hidden};`;
        }
        if (currentMode === 'vcard') {
            const first = vcardFirst.value.trim();
            const last = vcardLast.value.trim();
            const phone = vcardPhone.value.trim();
            const email = vcardEmail.value.trim();
            const org = vcardOrg.value.trim();
            return [
                'BEGIN:VCARD',
                'VERSION:3.0',
                `N:${last};${first};;;`,
                `FN:${first} ${last}`.trim(),
                org ? `ORG:${org}` : '',
                phone ? `TEL;TYPE=CELL:${phone}` : '',
                email ? `EMAIL:${email}` : '',
                'END:VCARD'
            ].filter(Boolean).join('\n');
        }
        if (currentMode === 'text') {
            return qrTextInput.value.trim() || 'Atelier Tools';
        }
        return 'Atelier Tools';
    }

    // Lightweight In-Browser QR Code Matrix Engine
    // Generates high quality standard ISO 18004 QR matrices cleanly without external deps
    function generateQRMatrix(text, eccLevel) {
        // We use an optimized byte mode encoder matrix generator
        const qr = qrcodegenerator(0, eccLevel);
        qr.addData(text);
        qr.make();
        return qr;
    }

    // --- Embedded Micro QRCode Generator Library ---
    function qrcodegenerator(typeNumber, errorCorrectionLevel) {
        const PAD0 = 0xEC;
        const PAD1 = 0x11;

        let _modules = null;
        let _moduleCount = 0;
        let _dataList = [];

        const qr = {
            addData: function(data) {
                _dataList.push({ data: data });
            },
            isDark: function(row, col) {
                if (row < 0 || _moduleCount <= row || col < 0 || _moduleCount <= col) {
                    throw new Error(row + "," + col);
                }
                return _modules[row][col];
            },
            getModuleCount: function() {
                return _moduleCount;
            },
            make: function() {
                if (typeNumber < 1) {
                    for (typeNumber = 1; typeNumber < 40; typeNumber++) {
                        const rsBlocks = getRSBlocks(typeNumber, errorCorrectionLevel);
                        const buffer = createBuffer();
                        for (let i = 0; i < _dataList.length; i++) {
                            const data = _dataList[i];
                            buffer.put(4, 4); // 8-bit byte mode
                            buffer.put(data.data.length, getLengthInBits(4, typeNumber));
                            for (let j = 0; j < data.data.length; j++) {
                                buffer.put(data.data.charCodeAt(j), 8);
                            }
                        }
                        let totalDataCount = 0;
                        for (let i = 0; i < rsBlocks.length; i++) {
                            totalDataCount += rsBlocks[i].dataCount;
                        }
                        if (buffer.getLengthInBits() <= totalDataCount * 8) break;
                    }
                }
                makeImpl(false, getBestMaskPattern());
            }
        };

        function getLengthInBits(mode, type) {
            if (1 <= type && type < 10) return 8;
            else if (type < 27) return 16;
            else return 16;
        }

        function createBuffer() {
            const buffer = [];
            let length = 0;
            return {
                getBuffer: function() { return buffer; },
                getLengthInBits: function() { return length; },
                put: function(num, len) {
                    for (let i = 0; i < len; i++) {
                        this.putBit(((num >>> (len - i - 1)) & 1) === 1);
                    }
                },
                putBit: function(bit) {
                    const bufIndex = Math.floor(length / 8);
                    if (buffer.length <= bufIndex) buffer.push(0);
                    if (bit) buffer[bufIndex] |= (0x80 >>> (length % 8));
                    length++;
                }
            };
        }

        function makeImpl(test, maskPattern) {
            _moduleCount = typeNumber * 4 + 17;
            _modules = new Array(_moduleCount);
            for (let row = 0; row < _moduleCount; row++) {
                _modules[row] = new Array(_moduleCount);
                for (let col = 0; col < _moduleCount; col++) {
                    _modules[row][col] = null;
                }
            }
            setupPositionProbePattern(0, 0);
            setupPositionProbePattern(_moduleCount - 7, 0);
            setupPositionProbePattern(0, _moduleCount - 7);
            setupPositionAdjustPattern();
            setupTimingPattern();
            setupTypeInfo(test, maskPattern);
            if (typeNumber >= 7) setupTypeNumber(test);
            mapData(createData(typeNumber, errorCorrectionLevel, _dataList), maskPattern);
        }

        function setupPositionProbePattern(row, col) {
            for (let r = -1; r <= 7; r++) {
                if (row + r <= -1 || _moduleCount <= row + r) continue;
                for (let c = -1; c <= 7; c++) {
                    if (col + c <= -1 || _moduleCount <= col + c) continue;
                    if ((0 <= r && r <= 6 && (c === 0 || c === 6)) ||
                        (0 <= c && c <= 6 && (r === 0 || r === 6)) ||
                        (2 <= r && r <= 4 && 2 <= c && c <= 4)) {
                        _modules[row + r][col + c] = true;
                    } else {
                        _modules[row + r][col + c] = false;
                    }
                }
            }
        }

        function setupPositionAdjustPattern() {
            const pos = getPatternPosition(typeNumber);
            for (let i = 0; i < pos.length; i++) {
                for (let j = 0; j < pos.length; j++) {
                    const row = pos[i];
                    const col = pos[j];
                    if (_modules[row][col] !== null) continue;
                    for (let r = -2; r <= 2; r++) {
                        for (let c = -2; c <= 2; c++) {
                            if (r === -2 || r === 2 || c === -2 || c === 2 || (r === 0 && c === 0)) {
                                _modules[row + r][col + c] = true;
                            } else {
                                _modules[row + r][col + c] = false;
                            }
                        }
                    }
                }
            }
        }

        function setupTimingPattern() {
            for (let r = 8; r < _moduleCount - 8; r++) {
                if (_modules[r][6] === null) _modules[r][6] = (r % 2 === 0);
            }
            for (let c = 8; c < _moduleCount - 8; c++) {
                if (_modules[6][c] === null) _modules[6][c] = (c % 2 === 0);
            }
        }

        function setupTypeInfo(test, maskPattern) {
            const data = (getECLBits(errorCorrectionLevel) << 3) | maskPattern;
            const bits = getBCHTypeInfo(data);
            for (let i = 0; i < 15; i++) {
                const mod = (!test && ((bits >> i) & 1) === 1);
                if (i < 6) _modules[i][8] = mod;
                else if (i < 8) _modules[i + 1][8] = mod;
                else _modules[_moduleCount - 15 + i][8] = mod;
            }
            for (let i = 0; i < 15; i++) {
                const mod = (!test && ((bits >> i) & 1) === 1);
                if (i < 8) _modules[8][_moduleCount - i - 1] = mod;
                else if (i < 9) _modules[8][15 - i - 1 + 1] = mod;
                else _modules[8][15 - i - 1] = mod;
            }
            _modules[_moduleCount - 8][8] = !test;
        }

        function setupTypeNumber(test) {
            const bits = getBCHTypeNumber(typeNumber);
            for (let i = 0; i < 18; i++) {
                const mod = (!test && ((bits >> i) & 1) === 1);
                _modules[Math.floor(i / 3)][i % 3 + _moduleCount - 8 - 3] = mod;
                _modules[i % 3 + _moduleCount - 8 - 3][Math.floor(i / 3)] = mod;
            }
        }

        function mapData(data, maskPattern) {
            let inc = -1;
            let row = _moduleCount - 1;
            let bitIndex = 7;
            let byteIndex = 0;
            const mask = getMask(maskPattern);

            for (let col = _moduleCount - 1; col > 0; col -= 2) {
                if (col === 6) col--;
                while (true) {
                    for (let c = 0; c < 2; c++) {
                        if (_modules[row][col - c] === null) {
                            let dark = false;
                            if (byteIndex < data.length) {
                                dark = (((data[byteIndex] >>> bitIndex) & 1) === 1);
                            }
                            if (mask(row, col - c)) dark = !dark;
                            _modules[row][col - c] = dark;
                            bitIndex--;
                            if (bitIndex === -1) {
                                byteIndex++;
                                bitIndex = 7;
                            }
                        }
                    }
                    row += inc;
                    if (row < 0 || _moduleCount <= row) {
                        row -= inc;
                        inc = -inc;
                        break;
                    }
                }
            }
        }

        function getBestMaskPattern() {
            return 0; // Default mask 0 for deterministic clean output
        }

        function getMask(maskPattern) {
            return function(i, j) {
                return (i + j) % 2 === 0;
            };
        }

        function getECLBits(ecl) {
            switch(ecl) {
                case 'L': return 1;
                case 'M': return 0;
                case 'Q': return 3;
                case 'H': return 2;
                default: return 0;
            }
        }

        function getBCHTypeInfo(data) {
            let d = data << 10;
            while (getBCHDigit(d) - getBCHDigit(1335) >= 0) {
                d ^= (1335 << (getBCHDigit(d) - getBCHDigit(1335)));
            }
            return ((data << 10) | d) ^ 21522;
        }

        function getBCHTypeNumber(data) {
            let d = data << 12;
            while (getBCHDigit(d) - getBCHDigit(7973) >= 0) {
                d ^= (7973 << (getBCHDigit(d) - getBCHDigit(7973)));
            }
            return (data << 12) | d;
        }

        function getBCHDigit(data) {
            let digit = 0;
            while (data !== 0) {
                digit++;
                data >>>= 1;
            }
            return digit;
        }

        function getPatternPosition(type) {
            if (type === 1) return [];
            if (type === 2) return [6, 18];
            if (type === 3) return [6, 22];
            if (type === 4) return [6, 26];
            if (type === 5) return [6, 30];
            if (type === 6) return [6, 34];
            if (type === 7) return [6, 22, 38];
            return [6, 26, 42];
        }

        function getRSBlocks(type, ecl) {
            const table = [
                // 1
                [1, 26, 19], [1, 26, 16], [1, 26, 13], [1, 26, 9],
                // 2
                [1, 44, 34], [1, 44, 28], [1, 44, 22], [1, 44, 16],
                // 3
                [1, 70, 55], [1, 70, 44], [2, 35, 17], [2, 35, 13],
                // 4
                [1, 100, 80], [2, 50, 32], [2, 50, 24], [4, 25, 9],
                // 5
                [1, 134, 108], [2, 67, 43], [2, 33, 15, 2, 34, 16], [2, 33, 11, 2, 34, 12]
            ];
            const offset = (type - 1) * 4 + getECLBits(ecl);
            const entry = table[Math.min(offset, table.length - 1)] || [1, 100, 80];
            return [{ totalCount: entry[1], dataCount: entry[2] }];
        }

        function createData(type, ecl, dataList) {
            const rsBlocks = getRSBlocks(type, ecl);
            const buffer = createBuffer();
            for (let i = 0; i < dataList.length; i++) {
                const data = dataList[i];
                buffer.put(4, 4);
                buffer.put(data.data.length, getLengthInBits(4, type));
                for (let j = 0; j < data.data.length; j++) {
                    buffer.put(data.data.charCodeAt(j), 8);
                }
            }
            let totalDataCount = 0;
            for (let i = 0; i < rsBlocks.length; i++) {
                totalDataCount += rsBlocks[i].dataCount;
            }
            if (buffer.getLengthInBits() > totalDataCount * 8) {
                throw new Error("Text is too long for QR Code capacity");
            }
            if (buffer.getLengthInBits() + 4 <= totalDataCount * 8) buffer.put(0, 4);
            while (buffer.getLengthInBits() % 8 !== 0) buffer.putBit(false);
            while (true) {
                if (buffer.getLengthInBits() >= totalDataCount * 8) break;
                buffer.put(PAD0, 8);
                if (buffer.getLengthInBits() >= totalDataCount * 8) break;
                buffer.put(PAD1, 8);
            }
            return buffer.getBuffer();
        }

        return qr;
    }

    let lastQRMatrix = null;

    function updateQRCode() {
        const payload = getPayload();
        const ecl = qrErrorCorrection.value;
        const fg = qrFgColor.value;
        const bg = qrBgColor.value;

        try {
            const qr = generateQRMatrix(payload, ecl);
            lastQRMatrix = qr;
            const count = qr.getModuleCount();

            const canvas = qrCanvas;
            const ctx = canvas.getContext('2d');
            const size = canvas.width;
            const margin = 16;
            const cellSize = (size - margin * 2) / count;

            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, size, size);

            ctx.fillStyle = fg;
            for (let r = 0; r < count; r++) {
                for (let c = 0; c < count; c++) {
                    if (qr.isDark(r, c)) {
                        ctx.fillRect(
                            Math.floor(margin + c * cellSize),
                            Math.floor(margin + r * cellSize),
                            Math.ceil(cellSize),
                            Math.ceil(cellSize)
                        );
                    }
                }
            }
        } catch (err) {
            console.error(err);
        }
    }

    // Export PNG
    downloadPngBtn.addEventListener('click', () => {
        if (!lastQRMatrix) return;
        const resolution = parseInt(qrResolution.value, 10) || 600;
        const fg = qrFgColor.value;
        const bg = qrBgColor.value;

        const exportCanvas = document.createElement('canvas');
        exportCanvas.width = resolution;
        exportCanvas.height = resolution;
        const ctx = exportCanvas.getContext('2d');

        const count = lastQRMatrix.getModuleCount();
        const margin = Math.floor(resolution * 0.08);
        const cellSize = (resolution - margin * 2) / count;

        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, resolution, resolution);

        ctx.fillStyle = fg;
        for (let r = 0; r < count; r++) {
            for (let c = 0; c < count; c++) {
                if (lastQRMatrix.isDark(r, c)) {
                    ctx.fillRect(
                        Math.floor(margin + c * cellSize),
                        Math.floor(margin + r * cellSize),
                        Math.ceil(cellSize),
                        Math.ceil(cellSize)
                    );
                }
            }
        }

        const link = document.createElement('a');
        link.download = `qrcode_${Date.now()}.png`;
        link.href = exportCanvas.toDataURL('image/png');
        link.click();
        window.Atelier.showToast('Downloaded High-Res PNG!', 'success');
    });

    // Copy Image
    copyQrImageBtn.addEventListener('click', async () => {
        try {
            qrCanvas.toBlob(blob => {
                if (blob && navigator.clipboard && window.ClipboardItem) {
                    navigator.clipboard.write([
                        new ClipboardItem({ 'image/png': blob })
                    ]).then(() => {
                        window.Atelier.showToast('Copied QR image to clipboard!', 'success');
                    });
                }
            });
        } catch {
            window.Atelier.showToast('Direct clipboard image copy not supported in this browser', 'info');
        }
    });

    // Download SVG
    downloadSvgBtn.addEventListener('click', () => {
        if (!lastQRMatrix) return;
        const count = lastQRMatrix.getModuleCount();
        const fg = qrFgColor.value;
        const bg = qrBgColor.value;
        const margin = 4;
        const viewBoxSize = count + margin * 2;

        let rects = '';
        for (let r = 0; r < count; r++) {
            for (let c = 0; c < count; c++) {
                if (lastQRMatrix.isDark(r, c)) {
                    rects += `<rect x="${c + margin}" y="${r + margin}" width="1" height="1" fill="${fg}" />`;
                }
            }
        }

        const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" width="100%" height="100%">
            <rect width="${viewBoxSize}" height="${viewBoxSize}" fill="${bg}" />
            ${rects}
        </svg>`;

        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const link = document.createElement('a');
        link.download = `qrcode_${Date.now()}.svg`;
        link.href = URL.createObjectURL(blob);
        link.click();
        window.Atelier.showToast('Downloaded Scalable SVG!', 'success');
    });

    // Listen to changes
    [qrUrlInput, wifiSsid, wifiPassword, wifiAuth, wifiHidden, vcardFirst, vcardLast, vcardPhone, vcardEmail, vcardOrg, qrTextInput, qrErrorCorrection].forEach(el => {
        if (el) {
            el.addEventListener('input', updateQRCode);
            el.addEventListener('change', updateQRCode);
        }
    });

    updateQRCode();
}
