export const html = `<h1>Base64 Encoder / Decoder</h1>
        <p class="subtitle">Convert files to Base64 Data URLs and decode strings back to files.</p>

        <div class="dropzone" id="dropzone" onclick="document.getElementById('fileInput').click()">
            <p>Click here to select files or drag & drop them here to encode</p>
            <input type="file" id="fileInput">
        </div>

        <div style="margin-bottom: 1.5rem;">
            <textarea id="base64Input" placeholder="...or paste raw Base64 string here to decode" class="textarea-field" style="height: 120px;"></textarea>
            <button id="decodeBtn" class="btn btn-primary" style="margin-top: 0.5rem;">Decode to File</button>
        </div>

        <div class="output-section" id="outputSection">
            <div class="code-box">
                <div class="code-title">Raw Base64</div>
                <button class="copy-btn" id="copyRawBtn">Copy</button>
                <pre id="rawBase64"></pre>
            </div>
            <div class="code-box">
                <div class="code-title">Data URL</div>
                <button class="copy-btn" id="copyDataUrlBtn">Copy</button>
                <pre id="dataUrl"></pre>
            </div>
        </div>`;

export function init() {
const fileInput = document.getElementById('fileInput');
        const dropzone = document.getElementById('dropzone');
        const outputSection = document.getElementById('outputSection');
        const rawBase64El = document.getElementById('rawBase64');
        const dataUrlEl = document.getElementById('dataUrl');
        const base64Input = document.getElementById('base64Input');
        const decodeBtn = document.getElementById('decodeBtn');

        let activeUrls = [];
        function purgeMemory() {
            activeUrls.forEach(url => URL.revokeObjectURL(url));
            activeUrls = [];
        }

        function showToast(message, isError = false) {
            window.Atelier.showToast(message, isError ? 'error' : 'success');
        }

        ['dragenter', 'dragover'].forEach(name => {
            dropzone.addEventListener(name, (e) => {
                e.preventDefault(); e.stopPropagation();
                dropzone.classList.add('drag-over');
            });
        });

        ['dragleave', 'drop'].forEach(name => {
            dropzone.addEventListener(name, (e) => {
                e.preventDefault(); e.stopPropagation();
                dropzone.classList.remove('drag-over');
            });
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files[0]) processFile(e.target.files[0]);
        });

        dropzone.addEventListener('drop', (e) => {
            if (e.dataTransfer.files[0]) processFile(e.dataTransfer.files[0]);
        });

        window.Atelier.setPasteHandler((e) => {
            const item = Array.from(e.clipboardData.items).find(i => i.kind === 'file');
            if (item) processFile(item.getAsFile());
        });

        function processFile(file) {
            purgeMemory();
            const reader = new FileReader();
            reader.onload = (e) => {
                const dataUrl = e.target.result;
                const base64 = dataUrl.split(',')[1];
                
                rawBase64El.textContent = base64.substring(0, 500) + (base64.length > 500 ? '...' : '');
                rawBase64El.dataset.full = base64;
                
                dataUrlEl.textContent = dataUrl.substring(0, 500) + (dataUrl.length > 500 ? '...' : '');
                dataUrlEl.dataset.full = dataUrl;
                
                outputSection.classList.add('active');
                showToast('Encoded to Base64 successfully');
            };
            reader.onerror = () => showToast('Failed to read file', true);
            reader.readAsDataURL(file);
        }

        function copyResult(id) {
            const el = document.getElementById(id);
            const text = el.dataset.full;
            navigator.clipboard.writeText(text).then(() => {
                showToast('Copied to clipboard!');
            }).catch(() => showToast('Failed to copy', true));
        }

        
        document.getElementById('copyRawBtn').addEventListener('click', () => copyResult('rawBase64'));
        document.getElementById('copyDataUrlBtn').addEventListener('click', () => copyResult('dataUrl'));

        decodeBtn.addEventListener('click', () => {
            const input = base64Input.value.trim();
            if (!input) {
                showToast('Please paste a Base64 string first', true);
                return;
            }
            
            try {
                let base64Data = input;
                let mime = 'application/octet-stream';
                
                if (input.startsWith('data:')) {
                    const parts = input.split(',');
                    mime = parts[0].split(':')[1].split(';')[0];
                    base64Data = parts[1];
                }
                
                const byteCharacters = atob(base64Data);
                const byteArrays = [];
                for (let offset = 0; offset < byteCharacters.length; offset += 512) {
                    const slice = byteCharacters.slice(offset, offset + 512);
                    const byteNumbers = new Array(slice.length);
                    for (let i = 0; i < slice.length; i++) {
                        byteNumbers[i] = slice.charCodeAt(i);
                    }
                    byteArrays.push(new Uint8Array(byteNumbers));
                }
                
                const blob = new Blob(byteArrays, {type: mime});
                const url = URL.createObjectURL(blob);
                activeUrls.push(url);
                
                const a = document.createElement('a');
                a.href = url;
                a.download = `decoded.${mime.split('/')[1] || 'bin'}`;
                a.click();
                showToast('Decoded and downloading...');
            } catch (err) {
                showToast('Invalid Base64 string', true);
            }
        });
}
