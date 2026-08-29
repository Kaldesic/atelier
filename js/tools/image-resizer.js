export const html = `
    <h1>Image Resizer</h1>
    <p class="subtitle">Resize images to exact dimensions or social media presets right in your browser.</p>

    <div class="dropzone" id="dropzone" style="cursor: pointer;">
        <p>Upload an image or drag & drop here</p>
        <input type="file" id="fileInput" accept="image/jpeg, image/png, image/webp" style="display: none;">
    </div>

    <div class="editor-section" id="editorSection" style="display: none; flex-direction: column; gap: 1rem; margin-top: 1.5rem;">
        <div class="presets-bar" style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <button class="preset-btn" id="preset-og">OpenGraph (1200x630)</button>
            <button class="preset-btn" id="preset-sq">Square (1080x1080)</button>
            <button class="preset-btn" id="preset-hd">Full HD (1920x1080)</button>
        </div>

        <div class="controls-grid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem; align-items: center;">
            <div class="input-group">
                <label for="widthInput" class="input-label">Width (px)</label>
                <input type="number" class="input-field" id="widthInput" min="1" placeholder="1920">
            </div>
            <div class="input-group">
                <label for="heightInput" class="input-label">Height (px)</label>
                <input type="number" class="input-field" id="heightInput" min="1" placeholder="1080">
            </div>
            <div class="checkbox-group" style="display: flex; align-items: center; gap: 0.5rem;">
                <input type="checkbox" id="aspectRatio" checked>
                <label for="aspectRatio">Maintain aspect ratio</label>
            </div>
        </div>

        <div class="preview-box" style="max-width: 100%; overflow: hidden; text-align: center;">
            <img id="imgPreview" alt="Preview" style="max-width: 100%; height: auto; border-radius: 4px;">
        </div>

        <button class="btn btn-primary" id="downloadResizedBtn">Download Resized Image</button>
    </div>
`;

export function init() {
    let activeUrls = [];
    let originalImg = new Image();
    let currentRatio = 1;
    let originalFileName = 'image';
    let originalFile = null;

    const fileInput = document.getElementById('fileInput');
    const dropzone = document.getElementById('dropzone');
    const editorSection = document.getElementById('editorSection');
    const imgPreview = document.getElementById('imgPreview');
    const widthInput = document.getElementById('widthInput');
    const heightInput = document.getElementById('heightInput');
    const aspectRatio = document.getElementById('aspectRatio');
    const downloadBtn = document.getElementById('downloadResizedBtn');
    const btnOg = document.getElementById('preset-og');
    const btnSq = document.getElementById('preset-sq');
    const btnHd = document.getElementById('preset-hd');

    function showToast(message, isError = false) {
        if (window.Atelier?.showToast) {
            window.Atelier.showToast(message, isError ? 'error' : 'success');
        }
    }

    function purgeMemory() {
        activeUrls.forEach(url => URL.revokeObjectURL(url));
        activeUrls = [];
        if (imgPreview && imgPreview.src.startsWith('blob:')) {
            URL.revokeObjectURL(imgPreview.src);
            imgPreview.src = '';
        }
    }

    // Paste handler
    if (window.Atelier?.setPasteHandler) {
        window.Atelier.setPasteHandler((e) => {
            const item = Array.from(e.clipboardData?.items || []).find(i => i.type.startsWith('image/'));
            if (item) {
                const file = item.getAsFile();
                if (file) loadImage(file);
            }
        });
    }

    const onDropzoneClick = () => fileInput?.click();
    dropzone?.addEventListener('click', onDropzoneClick);

    const preventDefaults = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const onDragOver = (e) => {
        preventDefaults(e);
        dropzone?.classList.add('drag-over');
    };

    const onDragLeave = (e) => {
        preventDefaults(e);
        dropzone?.classList.remove('drag-over');
    };

    const onDrop = (e) => {
        preventDefaults(e);
        dropzone?.classList.remove('drag-over');
        if (e.dataTransfer?.files?.[0]) {
            loadImage(e.dataTransfer.files[0]);
        }
    };

    ['dragenter', 'dragover'].forEach(name => dropzone?.addEventListener(name, onDragOver));
    ['dragleave', 'drop'].forEach(name => dropzone?.addEventListener(name, onDragLeave));
    dropzone?.addEventListener('drop', onDrop);

    const onFileInputChange = (e) => {
        if (e.target.files?.[0]) loadImage(e.target.files[0]);
    };
    fileInput?.addEventListener('change', onFileInputChange);

    function loadImage(file) {
        if (!file || file.size === 0) {
            showToast('Selected file is empty.', true);
            return;
        }

        if (!file.type.startsWith('image/')) {
            showToast('Please select a valid image file.', true);
            return;
        }

        purgeMemory();

        originalFile = file;
        originalFileName = file.name.replace(/\.[^/.]+$/, "");

        const blobUrl = URL.createObjectURL(file);
        activeUrls.push(blobUrl);

        originalImg = new Image();
        originalImg.onload = () => {
            currentRatio = originalImg.width / originalImg.height || 1;
            if (widthInput) widthInput.value = originalImg.width;
            if (heightInput) heightInput.value = originalImg.height;
            if (imgPreview) imgPreview.src = blobUrl;
            if (editorSection) editorSection.style.display = 'flex';
            showToast(`Image loaded (${originalImg.width}x${originalImg.height}px)`);
        };
        originalImg.onerror = () => showToast('Failed to load image preview.', true);
        originalImg.src = blobUrl;
    }

    const onWidthInput = () => {
        const val = parseInt(widthInput.value, 10);
        if (aspectRatio?.checked && val && val > 0 && currentRatio) {
            heightInput.value = Math.round(val / currentRatio);
        }
    };

    const onHeightInput = () => {
        const val = parseInt(heightInput.value, 10);
        if (aspectRatio?.checked && val && val > 0 && currentRatio) {
            widthInput.value = Math.round(val * currentRatio);
        }
    };

    widthInput?.addEventListener('input', onWidthInput);
    heightInput?.addEventListener('input', onHeightInput);

    const applyPreset = (w, h) => {
        if (aspectRatio) aspectRatio.checked = false;
        if (widthInput) widthInput.value = w;
        if (heightInput) heightInput.value = h;
        showToast(`Preset applied: ${w}x${h}`);
    };

    const onPresetOg = () => applyPreset(1200, 630);
    const onPresetSq = () => applyPreset(1080, 1080);
    const onPresetHd = () => applyPreset(1920, 1080);

    btnOg?.addEventListener('click', onPresetOg);
    btnSq?.addEventListener('click', onPresetSq);
    btnHd?.addEventListener('click', onPresetHd);

    function downloadResized() {
        const w = parseInt(widthInput?.value, 10);
        const h = parseInt(heightInput?.value, 10);

        if (!w || !h || w <= 0 || h <= 0) {
            showToast('Please enter valid positive dimensions.', true);
            return;
        }

        if (!originalImg.complete || !originalImg.naturalWidth) {
            showToast('No valid image loaded to resize.', true);
            return;
        }

        try {
            const canvas = document.createElement('canvas');
            canvas.width = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');

            const mimeType = originalFile?.type || 'image/png';
            
            if (mimeType === 'image/jpeg') {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, w, h);
            }

            ctx.drawImage(originalImg, 0, 0, w, h);

            canvas.toBlob((blob) => {
                if (!blob) {
                    showToast('Failed to process image.', true);
                    return;
                }
                const url = URL.createObjectURL(blob);
                activeUrls.push(url);

                const extMatch = originalFile?.name?.match(/\.([^/.]+)$/);
                const ext = extMatch ? extMatch[1] : (mimeType === 'image/jpeg' ? 'jpg' : 'png');

                const a = document.createElement('a');
                a.href = url;
                a.download = `${originalFileName}_resized_${w}x${h}.${ext}`;
                a.click();
                
                showToast('Resized image downloaded!');
            }, mimeType, 0.92);
        } catch (err) {
            showToast('Error resizing image.', true);
        }
    }

    downloadBtn?.addEventListener('click', downloadResized);

    return () => {
        purgeMemory();
        dropzone?.removeEventListener('click', onDropzoneClick);
        dropzone?.removeEventListener('dragenter', onDragOver);
        dropzone?.removeEventListener('dragover', onDragOver);
        dropzone?.removeEventListener('dragleave', onDragLeave);
        dropzone?.removeEventListener('drop', onDrop);
        fileInput?.removeEventListener('change', onFileInputChange);
        widthInput?.removeEventListener('input', onWidthInput);
        heightInput?.removeEventListener('input', onHeightInput);
        btnOg?.removeEventListener('click', onPresetOg);
        btnSq?.removeEventListener('click', onPresetSq);
        btnHd?.removeEventListener('click', onPresetHd);
        downloadBtn?.removeEventListener('click', downloadResized);
        if (window.Atelier?.setPasteHandler) {
            window.Atelier.setPasteHandler(null);
        }
    };
}
