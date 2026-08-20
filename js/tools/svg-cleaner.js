export const html = `<h1>SVG Cleaner & Minifier</h1>
        <p class="subtitle">Strip unnecessary metadata, comments, and editor junk from SVG files instantly.</p>

        <div class="dropzone" id="dropzone" onclick="document.getElementById('fileInput').click()">
            <p>Upload .svg file or drag & drop here</p>
            <input type="file" id="fileInput" accept=".svg,image/svg+xml">
        </div>

        <div class="editor-container">
            <textarea id="svgInput" placeholder="...or paste raw SVG code here"></textarea>
        </div>

        <div class="stats-bar" id="statsBar">
            <div class="stats-text" id="statsText">Original: 0 B | Cleaned: 0 B</div>
            <div class="stats-badge" id="statsBadge">0% saved</div>
        </div>

        <div class="actions">
            <button class="btn btn-outline" id="copyBtn"  disabled>Copy Cleaned SVG</button>
            <button class="btn" id="downloadBtn"  disabled>Download SVG</button>
        </div>

        <div class="preview-box" id="previewBox">
            <p style="color: var(--text-muted); font-size: 0.8rem; margin-bottom: 1rem;">LIVE PREVIEW</p>
            <div id="svgPreview"></div>
        </div>`;

export function init() {
window.Atelier.setPasteHandler((e) => {
            const item = Array.from(e.clipboardData.items).find(i => i.type.includes('svg'));
            if (item) {
                const file = item.getAsFile();
                readSVGFile(file);
            }
        });
        
        let activeUrls = [];
        function purgeMemory() {
            activeUrls.forEach(url => URL.revokeObjectURL(url));
            activeUrls = [];
        }

        const svgInput = document.getElementById('svgInput');
        const fileInput = document.getElementById('fileInput');
        const dropzone = document.getElementById('dropzone');
        const statsBar = document.getElementById('statsBar');
        const statsText = document.getElementById('statsText');
        const statsBadge = document.getElementById('statsBadge');
        const previewBox = document.getElementById('previewBox');
        const svgPreview = document.getElementById('svgPreview');
        const copyBtn = document.getElementById('copyBtn');
        const downloadBtn = document.getElementById('downloadBtn');

        let currentCleanedSVG = '';
        let originalFileName = 'vector';

        function showToast(message, isError = false) {
            window.Atelier.showToast(message, isError ? 'error' : 'success');
        }

        // Drag & Drop visual state
        ['dragenter', 'dragover'].forEach(name => {
            dropzone.addEventListener(name, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.add('drag-over');
            });
        });

        ['dragleave', 'drop'].forEach(name => {
            dropzone.addEventListener(name, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.remove('drag-over');
            });
        });

        svgInput.addEventListener('input', () => {
            originalFileName = 'cleaned';
            processSVG(svgInput.value);
        });

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) readSVGFile(file);
        });

        dropzone.addEventListener('drop', (e) => {
            const file = e.dataTransfer.files[0];
            if (file) {
                if (file.name.endsWith('.svg') || file.type === 'image/svg+xml') {
                    readSVGFile(file);
                } else {
                    showToast('Please upload a valid .svg file.', true);
                }
            }
        });

        function readSVGFile(file) {
            purgeMemory();
            originalFileName = file.name.replace(/\.[^/.]+$/, "");
            const reader = new FileReader();
            reader.onload = (e) => {
                svgInput.value = e.target.result;
                processSVG(e.target.result);
                showToast(`Loaded "${file.name}"`);
            };
            reader.onerror = () => showToast('Failed to read file.', true);
            reader.readAsText(file);
        }

        function processSVG(raw) {
            if (!raw.trim()) {
                resetUI();
                return;
            }

            const origSize = new Blob([raw]).size;

            // Cleaning pipeline
            let cleaned = raw
                .replace(/<\?xml[\s\S]*?\?>/gi, '') // Remove XML declaration
                .replace(/<!DOCTYPE[\s\S]*?>/gi, '') // Remove DOCTYPE
                .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
                .replace(/<metadata[\s\S]*?<\/metadata>/gi, '') // Remove metadata tags
                .replace(/<script[\s\S]*?<\/script>/gi, '') // Remove script elements
                .replace(/\s*(xmlns:sketch|sketch:type|xmlns:inkscape|xmlns:sodipodi|xmlns:dc|xmlns:cc|xmlns:rdf|inkscape:[a-z-]+|sodipodi:[a-z-]+|i:[a-z-]+)="[^"]*"/gi, '') // Remove editor attributes
                .replace(/\s+/g, ' ') // Collapse spaces
                .replace(/> </g, '><') // Collapse space between tags
                .trim();

            currentCleanedSVG = cleaned;
            const newSize = new Blob([cleaned]).size;
            const savedPct = origSize > 0 ? (((origSize - newSize) / origSize) * 100).toFixed(1) : 0;

            // Update UI
            statsText.innerText = `Original: ${origSize} B | Cleaned: ${newSize} B`;
            statsBadge.innerText = `${savedPct > 0 ? savedPct : 0}% saved`;
            statsBar.style.display = 'flex';

            svgPreview.innerHTML = cleaned;
            previewBox.style.display = 'block';

            copyBtn.disabled = false;
            downloadBtn.disabled = false;
        }

        function resetUI() {
            statsBar.style.display = 'none';
            previewBox.style.display = 'none';
            copyBtn.disabled = true;
            downloadBtn.disabled = true;
            currentCleanedSVG = '';
        }

        
        document.getElementById('copyBtn').addEventListener('click', copySVG);
        document.getElementById('downloadBtn').addEventListener('click', downloadSVG);

        function copySVG() {
            if (!currentCleanedSVG) return;
            navigator.clipboard.writeText(currentCleanedSVG)
                .then(() => showToast('Cleaned SVG copied to clipboard!'))
                .catch(() => showToast('Failed to copy to clipboard.', true));
        }

        function downloadSVG() {
            if (!currentCleanedSVG) return;
            const blob = new Blob([currentCleanedSVG], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
                            activeUrls.push(url);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${originalFileName}_cleaned.svg`;
            a.click();
            URL.revokeObjectURL(url);
            showToast('SVG file downloaded!');
        }
        
        
}
