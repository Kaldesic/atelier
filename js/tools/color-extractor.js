export const html = `<h1>Color Palette Extractor</h1>
        <p class="subtitle">Extract dominant color palettes and HEX/RGB codes from any image instantly.</p>

        <div class="dropzone" id="dropzone" onclick="document.getElementById('fileInput').click()">
            <p>Upload an image (PNG, JPG, WebP) or drag & drop here</p>
            <input type="file" id="fileInput" accept="image/*">
        </div>

        <div class="preview-container" id="previewContainer">
            <img id="imgPreview" class="image-preview" alt="Uploaded Preview">
            <div class="palette-grid" id="paletteGrid"></div>
        </div>`;

export function init() {
window.Atelier.setPasteHandler((e) => {
            const item = Array.from(e.clipboardData.items).find(i => i.type.startsWith('image/'));
            if (item) {
                const file = item.getAsFile();
                processImage(file);
            }
        });
        
        let activeUrls = [];
        function purgeMemory() {
            activeUrls.forEach(url => URL.revokeObjectURL(url));
            activeUrls = [];
        }

        const fileInput = document.getElementById('fileInput');
        const dropzone = document.getElementById('dropzone');
        const previewContainer = document.getElementById('previewContainer');
        const imgPreview = document.getElementById('imgPreview');
        const paletteGrid = document.getElementById('paletteGrid');

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

        fileInput.addEventListener('change', (e) => {
            if (e.target.files[0]) processImage(e.target.files[0]);
        });

        dropzone.addEventListener('drop', (e) => {
            if (e.dataTransfer.files[0]) processImage(e.dataTransfer.files[0]);
        });

        function processImage(file) {
            purgeMemory();
            if (!file || file.size === 0) {
                showToast('Selected file is empty or corrupted.', true);
                return;
            }

            if (!file.type.startsWith('image/')) {
                showToast(`Unsupported file type (${file.type || 'unknown'}). Please upload an image.`, true);
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                imgPreview.src = e.target.result;
                imgPreview.onload = () => {
                    try {
                        extractPalette(imgPreview);
                        previewContainer.style.display = 'flex';
                        showToast('Color palette extracted successfully!');
                    } catch (err) {
                        showToast('Error processing image palette.', true);
                    }
                };
                imgPreview.onerror = () => showToast('Failed to render image preview.', true);
            };
            reader.onerror = () => showToast('Failed to read file.', true);
            reader.readAsDataURL(file);
        }

        function extractPalette(img) {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 150;
            canvas.height = 150;

            ctx.drawImage(img, 0, 0, 150, 150);
            const imageData = ctx.getImageData(0, 0, 150, 150).data;

            const colorCounts = {};
            const step = 4 * 4; // Sample every 4th pixel

            for (let i = 0; i < imageData.length; i += step) {
                const r = Math.round(imageData[i] / 32) * 32;
                const g = Math.round(imageData[i + 1] / 32) * 32;
                const b = Math.round(imageData[i + 2] / 32) * 32;
                const a = imageData[i + 3];

                if (a < 128) continue; // Skip transparent pixels

                const key = `${r},${g},${b}`;
                colorCounts[key] = (colorCounts[key] || 0) + 1;
            }

            const sortedColors = Object.keys(colorCounts)
                .sort((a, b) => colorCounts[b] - colorCounts[a])
                .slice(0, 6);

            renderPalette(sortedColors);
        }

        function renderPalette(colorKeys) {
            paletteGrid.innerHTML = '';
            colorKeys.forEach(key => {
                const [r, g, b] = key.split(',').map(Number);
                const hex = rgbToHex(r, g, b);

                const card = document.createElement('div');
                card.className = 'color-card';
                card.onclick = () => copyToClipboard(hex);
                card.innerHTML = `
                    <div class="color-swatch" style="background-color: ${hex}"></div>
                    <div class="color-info">
                        <div class="color-hex">${hex}</div>
                        <div class="color-rgb">${r}, ${g}, ${b}</div>
                    </div>
                `;
                paletteGrid.appendChild(card);
            });
        }

        function rgbToHex(r, g, b) {
            return '#' + [r, g, b].map(x => {
                const hex = Math.min(255, Math.max(0, x)).toString(16);
                return hex.length === 1 ? '0' + hex : hex;
            }).join('');
        }

        function copyToClipboard(text) {
            navigator.clipboard.writeText(text).then(() => {
                showToast(`Copied ${text} to clipboard!`);
            }).catch(() => {
                showToast('Failed to copy to clipboard', true);
            });
        }

        
}
