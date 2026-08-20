export const html = `<h1>SVG Rasterizer</h1>
        <p class="subtitle">Convert vector SVG files to high-res PNG or WebP images.</p>

        <div class="dropzone" id="dropzone" onclick="document.getElementById('fileInput').click()">
            <p>Upload .svg file or drag & drop here</p>
            <input type="file" id="fileInput" accept=".svg,image/svg+xml">
        </div>

        <div class="output-section tool-section" id="outputSection" >
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1rem;">
                <div>
                    <label class="input-label">Scale Multiplier</label>
                    <select id="scaleSelect" class="select-field">
                        <option value="1">1x</option>
                        <option value="2" selected>2x</option>
                        <option value="4">4x</option>
                        <option value="8">8x</option>
                        <option value="16">16x</option>
                    </select>
                </div>
                <div>
                    <label class="input-label">Format</label>
                    <select id="formatSelect" class="select-field">
                        <option value="image/png">PNG</option>
                        <option value="image/webp">WebP</option>
                        <option value="image/jpeg">JPEG</option>
                    </select>
                </div>
            </div>
            
            <button id="convertBtn" class="btn btn-primary" style="width: 100%;">Download Rasterized Image</button>
            <div style="text-align: center; margin-top: 1rem;">
                <canvas id="previewCanvas" style="max-width: 100%; max-height: 250px; background: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAoAAAAKCAYAAACNMs+9AAAAJUlEQVQYV2N89erVfwY8QFJSEkQUg3UQVDEoAC6DqR0M+cEwCgBWfxr1H/6kKwAAAABJRU5ErkJggg==')"></canvas>
            </div>
        </div>`;

export function init() {
const fileInput = document.getElementById('fileInput');
        const dropzone = document.getElementById('dropzone');
        const outputSection = document.getElementById('outputSection');
        const scaleSelect = document.getElementById('scaleSelect');
        const formatSelect = document.getElementById('formatSelect');
        const convertBtn = document.getElementById('convertBtn');
        const previewCanvas = document.getElementById('previewCanvas');
        
        let currentSvgUrl = null;
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
            const item = Array.from(e.clipboardData.items).find(i => i.type.includes('svg'));
            if (item) processFile(item.getAsFile());
        });

        function processFile(file) {
            if (!file.type.includes('svg')) {
                showToast('Please upload an SVG file', true);
                return;
            }
            purgeMemory();
            
            const url = URL.createObjectURL(file);
            activeUrls.push(url);
            currentSvgUrl = url;
            
            updatePreview();
            outputSection.classList.add('active');
        }

        function updatePreview() {
            if (!currentSvgUrl) return;
            
            const img = new Image();
            img.onload = () => {
                const scale = parseInt(scaleSelect.value);
                previewCanvas.width = img.width * scale;
                previewCanvas.height = img.height * scale;
                const ctx = previewCanvas.getContext('2d');
                if (formatSelect.value === 'image/jpeg') {
                    ctx.fillStyle = '#ffffff';
                    ctx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
                }
                ctx.drawImage(img, 0, 0, previewCanvas.width, previewCanvas.height);
            };
            img.src = currentSvgUrl;
        }

        scaleSelect.addEventListener('change', updatePreview);
        formatSelect.addEventListener('change', updatePreview);

        convertBtn.addEventListener('click', () => {
            if (!currentSvgUrl) return;
            const format = formatSelect.value;
            previewCanvas.toBlob((blob) => {
                const url = URL.createObjectURL(blob);
                activeUrls.push(url);
                const a = document.createElement('a');
                a.href = url;
                a.download = `rasterized.${format.split('/')[1]}`;
                a.click();
                showToast('Image downloaded!');
            }, format, 1.0);
        });
}
