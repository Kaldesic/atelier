export const html = `
    <h1>Smart QR Code Studio</h1>
    <p class="subtitle">Generate custom, high-resolution QR codes client-side for WiFi, vCard Contacts, URLs, and text.</p>

    <div class="tool-section">
        <!-- Mode Tabs -->
        <div class="presets-bar" style="margin-bottom: 1.5rem;">
            <button class="preset-btn active" id="mode-url">Link / URL</button>
            <button class="preset-btn" id="mode-wifi">WiFi Network</button>
            <button class="preset-btn" id="mode-vcard">Contact (vCard)</button>
            <button class="preset-btn" id="mode-text">Plain Text / Email</button>
        </div>

        <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 2rem; align-items: start;" class="qr-layout-grid">
            <!-- Dynamic Input Configuration Area -->
            <div id="qrInputsContainer">
                <!-- URL Panel -->
                <div id="panel-url" class="qr-panel">
                    <div class="input-group">
                        <label for="qrUrlInput" class="input-label">Website or Destination URL</label>
                        <input type="url" id="qrUrlInput" class="input-field" value="https://kaldesic.github.io/atelier/" placeholder="https://example.com">
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
                    <button class="btn btn-primary" id="downloadPngBtn" style="width: 100%;">Download PNG</button>
                    <button class="btn btn-outline" id="copyQrImageBtn" style="width: 100%;">Copy Image to Clipboard</button>
                    <button class="btn btn-outline" id="downloadSvgBtn" style="width: 100%;">Download Scalable SVG</button>
                </div>
            </div>
        </div>
    </div>
`;

/* =========================================================================
   ISO/IEC 18004 QR Code Generation Engine (Versions 1 - 40)
   ========================================================================= */
const QR_ENGINE = (() => {
    const EXP_TABLE = new Uint8Array(512);
    const LOG_TABLE = new Uint8Array(256);

    let x = 1;
    for (let i = 0; i < 255; i++) {
        EXP_TABLE[i] = x;
        EXP_TABLE[i + 255] = x;
        LOG_TABLE[x] = i;
        x <<= 1;
        if (x & 256) x ^= 0x11D;
    }
    LOG_TABLE[0] = 0;

    function gmul(a, b) {
        if (a === 0 || b === 0) return 0;
        return EXP_TABLE[LOG_TABLE[a] + LOG_TABLE[b]];
    }

    function createGeneratorPoly(numECBytes) {
        let poly = new Uint8Array([1]);
        for (let i = 0; i < numECBytes; i++) {
            const next = new Uint8Array(poly.length + 1);
            const factor = EXP_TABLE[i];
            for (let j = 0; j < poly.length; j++) {
                next[j] ^= poly[j];
                next[j + 1] ^= gmul(poly[j], factor);
            }
            poly = next;
        }
        return poly;
    }

    function calculateReedSolomon(data, numECBytes) {
        const gen = createGeneratorPoly(numECBytes);
        const res = new Uint8Array(numECBytes);

        for (let i = 0; i < data.length; i++) {
            const factor = data[i] ^ res[0];
            for (let j = 0; j < numECBytes - 1; j++) {
                res[j] = res[j + 1] ^ gmul(gen[j + 1], factor);
            }
            res[numECBytes - 1] = gmul(gen[numECBytes], factor);
        }
        return res;
    }

    const ALIGNMENT_PATTERN_POS = [
        [],
        [6, 18], [6, 22], [6, 26], [6, 30], [6, 34], [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50],
        [6, 30, 54], [6, 32, 58], [6, 34, 62], [6, 26, 46, 66], [6, 26, 48, 70], [6, 26, 50, 74], [6, 30, 54, 78], [6, 30, 56, 82], [6, 30, 58, 86], [6, 34, 62, 90],
        [6, 28, 50, 72, 94], [6, 26, 50, 74, 98], [6, 30, 54, 78, 102], [6, 28, 54, 80, 106], [6, 32, 58, 84, 110], [6, 30, 58, 86, 114], [6, 34, 62, 90, 118],
        [6, 26, 50, 74, 98, 122], [6, 30, 54, 78, 102, 126], [6, 26, 52, 78, 104, 130], [6, 30, 56, 82, 108, 134],
        [6, 34, 60, 86, 112, 138], [6, 30, 58, 86, 114, 142], [6, 34, 62, 90, 118, 146],
        [6, 30, 54, 78, 102, 126, 150], [6, 24, 50, 76, 102, 128, 154], [6, 28, 54, 80, 106, 132, 158],
        [6, 32, 58, 84, 110, 136, 162], [6, 26, 54, 82, 110, 138, 166], [6, 30, 58, 86, 114, 142, 170]
    ];

    const VERSION_SPECS = [
        null,
        [ [26, 7, 1, 19, 0, 0], [26, 10, 1, 16, 0, 0], [26, 13, 1, 13, 0, 0], [26, 17, 1, 9, 0, 0] ],
        [ [44, 10, 1, 34, 0, 0], [44, 16, 1, 28, 0, 0], [44, 22, 1, 22, 0, 0], [44, 28, 1, 16, 0, 0] ],
        [ [70, 15, 1, 55, 0, 0], [70, 26, 1, 44, 0, 0], [70, 18, 2, 17, 0, 0], [70, 22, 2, 13, 0, 0] ],
        [ [100, 20, 1, 80, 0, 0], [100, 18, 2, 32, 0, 0], [100, 26, 2, 24, 0, 0], [100, 16, 4, 9, 0, 0] ],
        [ [134, 26, 1, 108, 0, 0], [134, 24, 2, 43, 0, 0], [134, 18, 2, 15, 2, 16], [134, 22, 2, 11, 2, 12] ],
        [ [172, 18, 2, 68, 0, 0], [172, 16, 4, 27, 0, 0], [172, 24, 4, 19, 0, 0], [172, 28, 4, 15, 0, 0] ],
        [ [196, 20, 2, 78, 0, 0], [196, 18, 4, 31, 0, 0], [196, 18, 2, 14, 4, 15], [196, 26, 4, 13, 1, 14] ],
        [ [242, 24, 2, 97, 0, 0], [242, 22, 2, 38, 2, 39], [242, 22, 4, 18, 2, 19], [242, 26, 4, 14, 2, 15] ],
        [ [292, 30, 2, 116, 0, 0], [292, 22, 3, 36, 2, 37], [292, 20, 4, 16, 4, 17], [292, 24, 4, 12, 4, 13] ],
        [ [346, 18, 2, 68, 2, 69], [346, 26, 4, 43, 1, 44], [346, 24, 6, 19, 2, 20], [346, 28, 6, 15, 2, 16] ],
        [ [404, 20, 4, 81, 0, 0], [404, 30, 1, 50, 4, 51], [404, 28, 4, 22, 4, 23], [404, 24, 3, 12, 8, 13] ],
        [ [466, 24, 2, 92, 2, 93], [466, 22, 6, 36, 2, 37], [466, 26, 4, 20, 6, 21], [466, 28, 7, 14, 4, 15] ],
        [ [532, 26, 4, 107, 0, 0], [532, 22, 8, 37, 1, 38], [532, 24, 8, 20, 4, 21], [532, 22, 12, 11, 4, 12] ],
        [ [581, 30, 3, 115, 1, 116], [581, 24, 4, 40, 5, 41], [581, 20, 11, 16, 5, 17], [581, 24, 11, 12, 5, 13] ],
        [ [655, 22, 5, 87, 1, 88], [655, 24, 5, 41, 5, 42], [655, 30, 5, 24, 7, 25], [655, 24, 11, 12, 7, 13] ],
        [ [733, 24, 5, 98, 1, 99], [733, 28, 7, 45, 3, 46], [733, 24, 15, 19, 2, 20], [733, 30, 3, 15, 13, 16] ],
        [ [815, 28, 1, 107, 5, 108], [815, 28, 10, 46, 1, 47], [815, 28, 1, 22, 15, 23], [815, 28, 2, 14, 17, 15] ],
        [ [901, 30, 5, 120, 1, 121], [901, 26, 9, 43, 4, 44], [901, 28, 17, 22, 1, 23], [901, 28, 2, 14, 19, 15] ],
        [ [991, 28, 3, 113, 4, 114], [991, 26, 3, 44, 11, 45], [991, 26, 17, 21, 4, 22], [991, 26, 9, 13, 16, 14] ],
        [ [1085, 28, 3, 107, 5, 108], [1085, 26, 3, 41, 13, 42], [1085, 30, 15, 24, 5, 25], [1085, 28, 15, 15, 10, 16] ],
        [ [1156, 28, 4, 116, 4, 117], [1156, 26, 17, 42, 0, 0], [1156, 28, 17, 22, 6, 23], [1156, 30, 19, 16, 6, 17] ],
        [ [1258, 28, 2, 111, 7, 112], [1258, 28, 17, 46, 0, 0], [1258, 30, 7, 24, 16, 25], [1258, 24, 34, 13, 0, 0] ],
        [ [1364, 30, 4, 121, 5, 122], [1364, 28, 4, 47, 14, 48], [1364, 30, 11, 24, 14, 25], [1364, 30, 16, 15, 14, 16] ],
        [ [1474, 30, 6, 117, 4, 118], [1474, 28, 6, 45, 14, 46], [1474, 30, 11, 24, 16, 25], [1474, 30, 30, 16, 2, 17] ],
        [ [1588, 26, 8, 106, 4, 107], [1588, 28, 8, 47, 13, 48], [1588, 30, 7, 24, 22, 25], [1588, 30, 22, 15, 13, 16] ],
        [ [1706, 28, 10, 114, 2, 115], [1706, 28, 19, 46, 4, 47], [1706, 28, 28, 22, 6, 23], [1706, 30, 33, 16, 4, 17] ],
        [ [1828, 30, 8, 122, 4, 123], [1828, 28, 22, 45, 3, 46], [1828, 30, 8, 23, 26, 24], [1828, 30, 12, 15, 28, 16] ],
        [ [1921, 30, 3, 117, 10, 118], [1921, 28, 3, 45, 23, 46], [1921, 30, 4, 24, 31, 25], [1921, 30, 11, 15, 31, 16] ],
        [ [2051, 30, 7, 116, 7, 117], [2051, 28, 21, 45, 7, 46], [2051, 30, 1, 23, 37, 24], [2051, 30, 19, 15, 26, 16] ],
        [ [2185, 30, 5, 115, 10, 116], [2185, 28, 19, 47, 10, 48], [2185, 30, 15, 24, 25, 25], [2185, 30, 23, 15, 25, 16] ],
        [ [2323, 30, 13, 115, 3, 116], [2323, 28, 2, 46, 29, 47], [2323, 30, 42, 24, 1, 25], [2323, 30, 23, 15, 28, 16] ],
        [ [2465, 30, 17, 115, 0, 0], [2465, 28, 10, 46, 23, 47], [2465, 30, 10, 24, 35, 25], [2465, 30, 19, 15, 35, 16] ],
        [ [2611, 30, 17, 115, 1, 116], [2611, 28, 14, 46, 21, 47], [2611, 30, 29, 24, 19, 25], [2611, 30, 11, 15, 46, 16] ],
        [ [2761, 30, 13, 115, 6, 116], [2761, 28, 14, 46, 23, 47], [2761, 30, 44, 24, 7, 25], [2761, 30, 59, 16, 1, 17] ],
        [ [2876, 30, 12, 121, 7, 122], [2876, 28, 12, 47, 26, 48], [2876, 30, 39, 24, 14, 25], [2876, 30, 22, 15, 41, 16] ],
        [ [3034, 30, 6, 121, 14, 122], [3034, 28, 6, 47, 34, 48], [3034, 30, 46, 24, 10, 25], [3034, 30, 2, 15, 64, 16] ],
        [ [3196, 30, 17, 122, 4, 123], [3196, 28, 29, 46, 14, 47], [3196, 30, 49, 24, 10, 25], [3196, 30, 24, 15, 46, 16] ],
        [ [3362, 30, 4, 122, 18, 123], [3362, 28, 13, 46, 32, 47], [3362, 30, 48, 24, 14, 25], [3362, 30, 42, 15, 32, 16] ],
        [ [3532, 30, 20, 117, 4, 118], [3532, 28, 40, 47, 7, 48], [3532, 30, 43, 24, 22, 25], [3532, 30, 10, 15, 67, 16] ],
        [ [3706, 30, 19, 118, 6, 119], [3706, 28, 18, 47, 31, 48], [3706, 30, 34, 24, 34, 25], [3706, 30, 20, 15, 61, 16] ]
    ];

    const ECC_LEVEL_MAP = {
        'L': { index: 0, formatBits: 1 },
        'M': { index: 1, formatBits: 0 },
        'Q': { index: 2, formatBits: 3 },
        'H': { index: 3, formatBits: 2 }
    };

    class BitBuffer {
        constructor() {
            this.buffer = [];
            this.length = 0;
        }

        put(num, len) {
            for (let i = 0; i < len; i++) {
                this.putBit(((num >>> (len - i - 1)) & 1) === 1);
            }
        }

        putBit(bit) {
            const bufIndex = Math.floor(this.length / 8);
            if (this.buffer.length <= bufIndex) this.buffer.push(0);
            if (bit) this.buffer[bufIndex] |= (0x80 >>> (this.length % 8));
            this.length++;
        }

        getBytes() {
            return new Uint8Array(this.buffer);
        }
    }

    function encodeUTF8(str) {
        const utf8 = [];
        for (let i = 0; i < str.length; i++) {
            let charcode = str.charCodeAt(i);
            if (charcode < 0x80) utf8.push(charcode);
            else if (charcode < 0x800) {
                utf8.push(0xc0 | (charcode >> 6), 0x80 | (charcode & 0x3f));
            } else if (charcode < 0xd800 || charcode >= 0xe000) {
                utf8.push(0xe0 | (charcode >> 12), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
            } else {
                i++;
                charcode = 0x10000 + (((charcode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
                utf8.push(0xf0 | (charcode >> 18), 0x80 | ((charcode >> 12) & 0x3f), 0x80 | ((charcode >> 6) & 0x3f), 0x80 | (charcode & 0x3f));
            }
        }
        return new Uint8Array(utf8);
    }

    function determineVersion(dataLength, eccIndex) {
        for (let v = 1; v <= 40; v++) {
            const spec = VERSION_SPECS[v][eccIndex];
            const maxDataCW = (spec[2] * spec[3]) + (spec[4] * spec[5]);
            const lengthBits = (v < 10) ? 8 : 16;
            if (4 + lengthBits + (dataLength * 8) <= maxDataCW * 8) return v;
        }
        return 40;
    }

    function createDataCodewords(rawBytes, version, eccIndex) {
        const spec = VERSION_SPECS[version][eccIndex];
        const totalDataCW = (spec[2] * spec[3]) + (spec[4] * spec[5]);
        const bitBuf = new BitBuffer();

        bitBuf.put(0x04, 4);
        bitBuf.put(rawBytes.length, (version < 10) ? 8 : 16);

        for (let i = 0; i < rawBytes.length; i++) bitBuf.put(rawBytes[i], 8);

        const totalDataBits = totalDataCW * 8;
        bitBuf.put(0, Math.min(4, totalDataBits - bitBuf.length));

        while (bitBuf.length % 8 !== 0) bitBuf.putBit(false);

        let padFlag = true;
        while (bitBuf.length < totalDataBits) {
            bitBuf.put(padFlag ? 0xEC : 0x11, 8);
            padFlag = !padFlag;
        }

        return bitBuf.getBytes();
    }

    function generateInterleavedCodewords(dataBytes, version, eccIndex) {
        const spec = VERSION_SPECS[version][eccIndex];
        const ecCWCount = spec[1];
        const g1Blocks = spec[2];
        const g1DataCW = spec[3];
        const g2Blocks = spec[4];
        const g2DataCW = spec[5];
        const totalBlocks = g1Blocks + g2Blocks;

        const dataBlocks = [];
        const ecBlocks = [];
        let offset = 0;

        for (let i = 0; i < g1Blocks; i++) {
            const block = dataBytes.slice(offset, offset + g1DataCW);
            dataBlocks.push(block);
            ecBlocks.push(calculateReedSolomon(block, ecCWCount));
            offset += g1DataCW;
        }

        for (let i = 0; i < g2Blocks; i++) {
            const block = dataBytes.slice(offset, offset + g2DataCW);
            dataBlocks.push(block);
            ecBlocks.push(calculateReedSolomon(block, ecCWCount));
            offset += g2DataCW;
        }

        const maxDataLen = Math.max(g1DataCW, g2DataCW);
        const finalCodewords = [];

        for (let i = 0; i < maxDataLen; i++) {
            for (let b = 0; b < totalBlocks; b++) {
                if (i < dataBlocks[b].length) finalCodewords.push(dataBlocks[b][i]);
            }
        }

        for (let i = 0; i < ecCWCount; i++) {
            for (let b = 0; b < totalBlocks; b++) {
                finalCodewords.push(ecBlocks[b][i]);
            }
        }

        return new Uint8Array(finalCodewords);
    }

    const MASK_FNS = [
        (r, c) => (r + c) % 2 === 0,
        (r, c) => r % 2 === 0,
        (r, c) => c % 3 === 0,
        (r, c) => (r + c) % 3 === 0,
        (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
        (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
        (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
        (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0
    ];

    function getBCHTypeInfo(data) {
        let d = data << 10;
        for (let i = 4; i >= 0; i--) {
            if ((d >> (i + 10)) & 1) d ^= (0x537 << i);
        }
        return ((data << 10) | d) ^ 0x5412;
    }

    function getBCHTypeNumber(version) {
        let d = version << 12;
        for (let i = 5; i >= 0; i--) {
            if ((d >> (i + 12)) & 1) d ^= (0x1F25 << i);
        }
        return (version << 12) | d;
    }

    class QRCodeMatrix {
        constructor(version, eccLevel) {
            this.version = version;
            this.eccLevel = eccLevel;
            this.moduleCount = version * 4 + 17;
            this.modules = Array.from({ length: this.moduleCount }, () => new Array(this.moduleCount).fill(null));
            this.isReserved = Array.from({ length: this.moduleCount }, () => new Array(this.moduleCount).fill(false));
        }

        getModuleCount() { return this.moduleCount; }
        isDark(row, col) { return this.modules[row][col] === true; }

        setModule(row, col, dark, reserved = true) {
            if (row >= 0 && row < this.moduleCount && col >= 0 && col < this.moduleCount) {
                this.modules[row][col] = dark;
                this.isReserved[row][col] = reserved;
            }
        }

        placeFinderPattern(row, col) {
            for (let r = -1; r <= 7; r++) {
                for (let c = -1; c <= 7; c++) {
                    const nr = row + r, nc = col + c;
                    if (nr >= 0 && nr < this.moduleCount && nc >= 0 && nc < this.moduleCount) {
                        if (r >= 0 && r <= 6 && c >= 0 && c <= 6) {
                            const isBlack = (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4));
                            this.setModule(nr, nc, isBlack, true);
                        } else {
                            this.setModule(nr, nc, false, true);
                        }
                    }
                }
            }
        }

        placeAlignmentPatterns() {
            const pos = ALIGNMENT_PATTERN_POS[this.version - 1];
            if (!pos) return;

            for (let i = 0; i < pos.length; i++) {
                for (let j = 0; j < pos.length; j++) {
                    const row = pos[i], col = pos[j];
                    if (this.isReserved[row][col]) continue;

                    for (let r = -2; r <= 2; r++) {
                        for (let c = -2; c <= 2; c++) {
                            const isBlack = (Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0));
                            this.setModule(row + r, col + c, isBlack, true);
                        }
                    }
                }
            }
        }

        placeTimingPatterns() {
            for (let i = 8; i < this.moduleCount - 8; i++) {
                if (this.modules[6][i] === null) this.setModule(6, i, i % 2 === 0, true);
                if (this.modules[i][6] === null) this.setModule(i, 6, i % 2 === 0, true);
            }
        }

        reserveFormatAndVersion() {
            for (let i = 0; i < 9; i++) {
                if (i !== 6) {
                    this.isReserved[8][i] = true;
                    this.isReserved[i][8] = true;
                }
            }
            for (let i = this.moduleCount - 8; i < this.moduleCount; i++) {
                this.isReserved[8][i] = true;
                this.isReserved[i][8] = true;
            }
            this.setModule(this.moduleCount - 8, 8, true, true);

            if (this.version >= 7) {
                for (let i = 0; i < 6; i++) {
                    for (let j = 0; j < 3; j++) {
                        this.isReserved[i][this.moduleCount - 11 + j] = true;
                        this.isReserved[this.moduleCount - 11 + j][i] = true;
                    }
                }
            }
        }

        placeFormatInfo(maskPattern) {
            const eccBits = ECC_LEVEL_MAP[this.eccLevel].formatBits;
            const formatBCH = getBCHTypeInfo((eccBits << 3) | maskPattern);

            // Copy 1: around the top-left finder pattern.
            // The format bits are written vertically and horizontally in
            // the exact locations required by the QR Code specification.
            for (let i = 0; i < 15; i++) {
                const bit = ((formatBCH >> i) & 1) === 1;

                if (i < 6) {
                    this.modules[i][8] = bit;
                } else if (i < 8) {
                    this.modules[i + 1][8] = bit;
                } else {
                    this.modules[this.moduleCount - 15 + i][8] = bit;
                }

                if (i < 8) {
                    this.modules[8][this.moduleCount - i - 1] = bit;
                } else if (i < 9) {
                    this.modules[8][7] = bit;
                } else {
                    this.modules[8][15 - i - 1] = bit;
                }
            }

            // Fixed dark module.
            this.modules[this.moduleCount - 8][8] = true;
        }

        placeVersionInfo() {
            if (this.version < 7) return;
            const versionBCH = getBCHTypeNumber(this.version);
            for (let i = 0; i < 18; i++) {
                const bit = ((versionBCH >> i) & 1) === 1;
                const r = Math.floor(i / 3);
                const c = this.moduleCount - 11 + (i % 3);
                this.modules[r][c] = bit;
                this.modules[c][r] = bit;
            }
        }

        mapData(codewords, maskPattern) {
            const maskFn = MASK_FNS[maskPattern];
            let byteIndex = 0, bitIndex = 7, upward = true;

            for (let right = this.moduleCount - 1; right > 0; right -= 2) {
                if (right === 6) right--;
                const cols = [right, right - 1];
                const rows = upward
                    ? Array.from({ length: this.moduleCount }, (_, i) => this.moduleCount - 1 - i)
                    : Array.from({ length: this.moduleCount }, (_, i) => i);

                for (const row of rows) {
                    for (const col of cols) {
                        if (!this.isReserved[row][col]) {
                            let bitVal = false;
                            if (byteIndex < codewords.length) {
                                bitVal = ((codewords[byteIndex] >> bitIndex) & 1) === 1;
                                bitIndex--;
                                if (bitIndex < 0) {
                                    bitIndex = 7;
                                    byteIndex++;
                                }
                            }
                            if (maskFn(row, col)) bitVal = !bitVal;
                            this.modules[row][col] = bitVal;
                        }
                    }
                }
                upward = !upward;
            }
        }

        evaluatePenalty() {
            let penalty = 0;
            const size = this.moduleCount;

            for (let r = 0; r < size; r++) {
                let count = 1;
                for (let c = 1; c < size; c++) {
                    if (this.modules[r][c] === this.modules[r][c - 1]) count++;
                    else {
                        if (count >= 5) penalty += 3 + (count - 5);
                        count = 1;
                    }
                }
                if (count >= 5) penalty += 3 + (count - 5);
            }

            for (let c = 0; c < size; c++) {
                let count = 1;
                for (let r = 1; r < size; r++) {
                    if (this.modules[r][c] === this.modules[r - 1][c]) count++;
                    else {
                        if (count >= 5) penalty += 3 + (count - 5);
                        count = 1;
                    }
                }
                if (count >= 5) penalty += 3 + (count - 5);
            }

            for (let r = 0; r < size - 1; r++) {
                for (let c = 0; c < size - 1; c++) {
                    const color = this.modules[r][c];
                    if (color === this.modules[r][c + 1] &&
                        color === this.modules[r + 1][c] &&
                        color === this.modules[r + 1][c + 1]) {
                        penalty += 3;
                    }
                }
            }

            // Rule 3: finder-like 1:1:3:1:1 pattern in rows/columns.
            for (let r = 0; r < size; r++) {
                for (let c = 0; c <= size - 11; c++) {
                    if (this.modules[r][c] &&
                        !this.modules[r][c + 1] &&
                        this.modules[r][c + 2] &&
                        this.modules[r][c + 3] &&
                        this.modules[r][c + 4] &&
                        !this.modules[r][c + 5] &&
                        this.modules[r][c + 6] &&
                        !this.modules[r][c + 7] &&
                        !this.modules[r][c + 8] &&
                        !this.modules[r][c + 9] &&
                        !this.modules[r][c + 10]) {
                        penalty += 40;
                    }
                    if (!this.modules[r][c] &&
                        !this.modules[r][c + 1] &&
                        !this.modules[r][c + 2] &&
                        !this.modules[r][c + 3] &&
                        this.modules[r][c + 4] &&
                        !this.modules[r][c + 5] &&
                        this.modules[r][c + 6] &&
                        this.modules[r][c + 7] &&
                        this.modules[r][c + 8] &&
                        !this.modules[r][c + 9] &&
                        this.modules[r][c + 10]) {
                        penalty += 40;
                    }
                }
            }

            for (let c = 0; c < size; c++) {
                for (let r = 0; r <= size - 11; r++) {
                    if (this.modules[r][c] &&
                        !this.modules[r + 1][c] &&
                        this.modules[r + 2][c] &&
                        this.modules[r + 3][c] &&
                        this.modules[r + 4][c] &&
                        !this.modules[r + 5][c] &&
                        this.modules[r + 6][c] &&
                        !this.modules[r + 7][c] &&
                        !this.modules[r + 8][c] &&
                        !this.modules[r + 9][c] &&
                        !this.modules[r + 10][c]) {
                        penalty += 40;
                    }
                    if (!this.modules[r][c] &&
                        !this.modules[r + 1][c] &&
                        !this.modules[r + 2][c] &&
                        !this.modules[r + 3][c] &&
                        this.modules[r + 4][c] &&
                        !this.modules[r + 5][c] &&
                        this.modules[r + 6][c] &&
                        this.modules[r + 7][c] &&
                        this.modules[r + 8][c] &&
                        !this.modules[r + 9][c] &&
                        this.modules[r + 10][c]) {
                        penalty += 40;
                    }
                }
            }

            let darkCount = 0;
            for (let r = 0; r < size; r++) {
                for (let c = 0; c < size; c++) {
                    if (this.modules[r][c]) darkCount++;
                }
            }
            const ratio = (darkCount / (size * size)) * 100;
            penalty += Math.floor(Math.abs(ratio - 50) / 5) * 10;

            return penalty;
        }
    }

    function generate(text, ecl) {
        const eccLevel = ['L', 'M', 'Q', 'H'].includes(ecl) ? ecl : 'M';
        const eccIndex = ECC_LEVEL_MAP[eccLevel].index;

        const rawBytes = encodeUTF8(String(text ?? ''));
        const version = determineVersion(rawBytes.length, eccIndex);

        // Version 40 still has a finite capacity. Give the UI a useful
        // error instead of failing later with a cryptic bit-buffer error.
        const maxDataCW = (() => {
            const spec = VERSION_SPECS[version][eccIndex];
            return (spec[2] * spec[3]) + (spec[4] * spec[5]);
        })();

        const lengthBits = version < 10 ? 8 : 16;
        const requiredBits = 4 + lengthBits + (rawBytes.length * 8);
        if (requiredBits > maxDataCW * 8) {
            throw new Error('The input is too long for a QR Code at error correction level ' + eccLevel + '.');
        }

        const dataCW = createDataCodewords(rawBytes, version, eccIndex);
        const interleavedCW = generateInterleavedCodewords(dataCW, version, eccIndex);

        let lowestPenalty = Infinity;
        let bestMatrix = null;

        for (let mask = 0; mask < 8; mask++) {
            const matrix = new QRCodeMatrix(version, eccLevel);
            matrix.placeFinderPattern(0, 0);
            matrix.placeFinderPattern(matrix.moduleCount - 7, 0);
            matrix.placeFinderPattern(0, matrix.moduleCount - 7);
            matrix.placeAlignmentPatterns();
            matrix.placeTimingPatterns();
            matrix.reserveFormatAndVersion();

            matrix.placeFormatInfo(mask);
            matrix.placeVersionInfo();
            matrix.mapData(interleavedCW, mask);

            const penalty = matrix.evaluatePenalty();
            if (penalty < lowestPenalty) {
                lowestPenalty = penalty;
                bestMatrix = matrix;
            }
        }

        return bestMatrix;
    }

    return { generate };
})();

export function init() {
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
    let lastQRMatrix = null;

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
            return qrUrlInput.value.trim() || 'https://kaldesic.github.io/atelier/';
        }
        if (currentMode === 'wifi') {
            const ssid = (wifiSsid.value || 'HomeNetwork').replace(/([\\;,:])/g, '\\$1');
            const pass = (wifiPassword.value || '').replace(/([\\;,:])/g, '\\$1');
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

    function updateQRCode() {
        const payload = getPayload();
        const ecl = qrErrorCorrection.value;
        const fg = qrFgColor.value;
        const bg = qrBgColor.value;

        try {
            const qr = QR_ENGINE.generate(payload, ecl);
            lastQRMatrix = qr;
            const count = qr.getModuleCount();

            const canvas = qrCanvas;
            const ctx = canvas.getContext('2d', { alpha: false });
            const size = canvas.width;

            // Render at an integer number of pixels per QR module to keep
            // every edge razor-sharp and scanner-friendly.
            const quietModules = 4;
            const cells = count + quietModules * 2;
            const cellSize = Math.max(1, Math.floor(size / cells));
            const renderedSize = cellSize * cells;
            const offset = Math.floor((size - renderedSize) / 2);

            ctx.imageSmoothingEnabled = false;
            ctx.fillStyle = bg;
            ctx.fillRect(0, 0, size, size);

            ctx.fillStyle = fg;
            for (let r = 0; r < count; r++) {
                for (let c = 0; c < count; c++) {
                    if (qr.isDark(r, c)) {
                        ctx.fillRect(
                            offset + (c + quietModules) * cellSize,
                            offset + (r + quietModules) * cellSize,
                            cellSize,
                            cellSize
                        );
                    }
                }
            }
        } catch (err) {
            console.error('QR Generator Error:', err);
            lastQRMatrix = null;
            const ctx = qrCanvas.getContext('2d');
            ctx.clearRect(0, 0, qrCanvas.width, qrCanvas.height);
            ctx.fillStyle = qrBgColor.value;
            ctx.fillRect(0, 0, qrCanvas.width, qrCanvas.height);

            if (window.Atelier && window.Atelier.showToast) {
                window.Atelier.showToast(
                    err instanceof Error ? err.message : 'Could not generate QR code.',
                    'error'
                );
            }
        }
    }

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
        const quietModules = 4;
        const cells = count + quietModules * 2;
        const cellSize = Math.max(1, Math.floor(resolution / cells));
        const renderedSize = cellSize * cells;
        const offset = Math.floor((resolution - renderedSize) / 2);

        ctx.imageSmoothingEnabled = false;
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, resolution, resolution);

        ctx.fillStyle = fg;
        for (let r = 0; r < count; r++) {
            for (let c = 0; c < count; c++) {
                if (lastQRMatrix.isDark(r, c)) {
                    ctx.fillRect(
                        offset + (c + quietModules) * cellSize,
                        offset + (r + quietModules) * cellSize,
                        cellSize,
                        cellSize
                    );
                }
            }
        }

        const link = document.createElement('a');
        link.download = `qrcode_${Date.now()}.png`;
        link.href = exportCanvas.toDataURL('image/png');
        link.click();
        if (window.Atelier && window.Atelier.showToast) {
            window.Atelier.showToast('Downloaded High-Res PNG!', 'success');
        }
    });

    copyQrImageBtn.addEventListener('click', async () => {
        try {
            if (!navigator.clipboard || !window.ClipboardItem) {
                throw new Error('Clipboard image API unavailable');
            }

            const blob = await new Promise((resolve) => {
                qrCanvas.toBlob(resolve, 'image/png');
            });

            if (!blob) throw new Error('Could not create PNG blob');

            await navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]);

            if (window.Atelier && window.Atelier.showToast) {
                window.Atelier.showToast('Copied QR image to clipboard!', 'success');
            }
        } catch {
            if (window.Atelier && window.Atelier.showToast) {
                window.Atelier.showToast('Image clipboard copy is not supported here. Use Download PNG instead.', 'info');
            }
        }
    });

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

        const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${viewBoxSize} ${viewBoxSize}" width="100%" height="100%"><rect width="${viewBoxSize}" height="${viewBoxSize}" fill="${bg}" />${rects}</svg>`;

        const blob = new Blob([svgContent], { type: 'image/svg+xml' });
        const link = document.createElement('a');
        link.download = `qrcode_${Date.now()}.svg`;
        link.href = URL.createObjectURL(blob);
        link.click();
        if (window.Atelier && window.Atelier.showToast) {
            window.Atelier.showToast('Downloaded Scalable SVG!', 'success');
        }
    });

    [qrUrlInput, wifiSsid, wifiPassword, wifiAuth, wifiHidden, vcardFirst, vcardLast, vcardPhone, vcardEmail, vcardOrg, qrTextInput, qrErrorCorrection, qrResolution].forEach(el => {
        if (el) {
            el.addEventListener('input', updateQRCode);
            el.addEventListener('change', updateQRCode);
        }
    });

    updateQRCode();
}
