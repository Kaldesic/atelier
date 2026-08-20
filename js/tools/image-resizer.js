export const html = `<h1>Image Resizer</h1>
        <p class="subtitle">Resize images to exact dimensions or social media presets right in your browser.</p>

        <div class="dropzone" id="dropzone" onclick="document.getElementById('fileInput').click()">
            <p>Upload an image or drag & drop here</p>
            <input type="file" id="fileInput" accept="image/*">
        </div>

        <div class="editor-section" id="editorSection">
            <div class="presets-bar">
                <button class="preset-btn" onclick="applyPreset(1200, 630)">OpenGraph (1200x630)</button>
                <button class="preset-btn" onclick="applyPreset(1080, 1080)">Square (1080x1080)</button>
                <button class="preset-btn" onclick="applyPreset(1920, 1080)">Full HD (1920x1080)</button>
            </div>

            <div class="controls-grid">
                <div class="input-group">
                    <label for="widthInput">Width (px)</label>
                    <input type="number" id="widthInput" min="1" placeholder="1920">
                </div>
                <div class="input-group">
                    <label for="heightInput">Height (px)</label>
                    <input type="number" id="heightInput" min="1" placeholder="1080">
                </div>
                <div class="checkbox-group">
                    <input type="checkbox" id="aspectRatio" checked>
                    <label for="aspectRatio">Maintain aspect ratio</label>
                </div>
            </div>

            <div class="preview-box">
                <img id="imgPreview" alt="Preview">
            </div>

            <button class="btn" onclick="downloadResized()">Download Resized Image</button>
        </div>
    </div>

    <div class="toast" id="toast">`;

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
        const editorSection = document.getElementById('editorSection');
        const imgPreview = document.getElementById('imgPreview');
        const widthInput = document.getElementById('widthInput');
        const heightInput = document.getElementById('heightInput');
        const aspectRatio = document.getElementById('aspectRatio');

        let originalImg = new Image();
        let currentRatio = 1;
        let originalFileName = 'image';
        let originalFile = null;

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
            if (e.target.files[0]) loadImage(e.target.files[0]);
        });

        dropzone.addEventListener('drop', (e) => {
            if (e.dataTransfer.files[0]) loadImage(e.dataTransfer.files[0]);
        });

        function loadImage(file) {
            if (!file || file.size === 0) {
                showToast('Selected file is empty.', true);
                return;
            }

            if (!file.type.startsWith('image/')) {
                showToast('Please select a valid image file.', true);
                return;
            }

            originalFile = file;
            originalFileName = file.name.replace(/\.[^/.]+$/, "");

            const reader = new FileReader();
            reader.onload = (e) => {
                originalImg = new Image();
                originalImg.onload = () => {
                    currentRatio = originalImg.width / originalImg.height;
                    widthInput.value = originalImg.width;
                    heightInput.value = originalImg.height;
                    imgPreview.src = e.target.result;
                    editorSection.style.display = 'flex';
                    showToast(`Image loaded (${originalImg.width}x${originalImg.height}px)`);
                };
                originalImg.onerror = () => showToast('Failed to load image preview.', true);
                originalImg.src = e.target.result;
            };
            reader.onerror = () => showToast('Error reading file.', true);
            reader.readAsDataURL(file);
        }

        widthInput.addEventListener('input', () => {
            const val = parseInt(widthInput.value);
            if (aspectRatio.checked && val && val > 0) {
                heightInput.value = Math.round(val / currentRatio);
            }
        });

        heightInput.addEventListener('input', () => {
            const val = parseInt(heightInput.value);
            if (aspectRatio.checked && val && val > 0) {
                widthInput.value = Math.round(val * currentRatio);
            }
        });

        function applyPreset(w, h) {
            aspectRatio.checked = false;
            widthInput.value = w;
            heightInput.value = h;
            showToast(`Preset applied: ${w}x${h}`);
        }

        function downloadResized() {
            const w = parseInt(widthInput.value);
            const h = parseInt(heightInput.value);

            if (!w || !h || w <= 0 || h <= 0) {
                showToast('Please enter valid positive dimensions.', true);
                return;
            }

            try {
                const canvas = document.createElement('canvas');
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext('2d');

                ctx.drawImage(originalImg, 0, 0, w, h);

                canvas.toBlob((blob) => {
                    if (!blob) {
                        showToast('Failed to process image.', true);
                        return;
                    }
                    const url = URL.createObjectURL(blob);
                            activeUrls.push(url);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `${originalFileName}_resized_${w}x${h}.png`;
                    a.click();
                    URL.revokeObjectURL(url);
                    showToast('Resized image downloaded!');
                }, 'image/png');
            } catch (err) {
                showToast('Error resizing image.', true);
            }
        }
        
        
}
