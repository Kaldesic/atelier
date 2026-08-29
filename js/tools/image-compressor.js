export const html = `
    <h1>Image Compressor</h1>
    <p class="subtitle">Reduce JPEG, PNG, and WebP file sizes directly in your browser.</p>

    <div class="tool-section" style="display:flex; justify-content:space-between; align-items:center;">
        <label style="display:flex; align-items:center; gap:0.5rem;">
            <span style="font-weight:500; font-size:0.9rem;">Compression Quality</span>
            <span id="qualityVal">75%</span>
        </label>
        <input type="range" id="qualityRange" min="10" max="100" value="75">
    </div>

    <div class="dropzone" id="dropzone" style="cursor: pointer;">
        <p>Upload images (JPG, PNG, WebP) or drag & drop here</p>
        <input type="file" id="fileInput" accept="image/jpeg, image/png, image/webp" multiple style="display: none;">
    </div>

    <div class="results" id="results" style="margin-top: 1.5rem;"></div>
`;

export function init() {
    let activeUrls = [];
    let currentFiles = [];
    let debounceTimer = null;

    const fileInput = document.getElementById('fileInput');
    const resultsContainer = document.getElementById('results');
    const dropzone = document.getElementById('dropzone');
    const qualityRange = document.getElementById('qualityRange');
    const qualityVal = document.getElementById('qualityVal');

    function showToast(message, isError = false) {
        if (window.Atelier?.showToast) {
            window.Atelier.showToast(message, isError ? 'error' : 'success');
        }
    }

    function purgeMemory() {
        activeUrls.forEach(url => URL.revokeObjectURL(url));
        activeUrls = [];
    }

    // Paste handler
    if (window.Atelier?.setPasteHandler) {
        window.Atelier.setPasteHandler((e) => {
            const item = Array.from(e.clipboardData?.items || []).find(i => i.type.startsWith('image/'));
            if (item) {
                const file = item.getAsFile();
                if (file) handleNewFiles([file]);
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
        if (e.dataTransfer?.files?.length > 0) {
            handleNewFiles(Array.from(e.dataTransfer.files));
        }
    };

    ['dragenter', 'dragover'].forEach(evt => dropzone?.addEventListener(evt, onDragOver));
    ['dragleave', 'drop'].forEach(evt => dropzone?.addEventListener(evt, onDragLeave));
    dropzone?.addEventListener('drop', onDrop);

    const onFileInputChange = (e) => {
        if (e.target.files?.length > 0) {
            handleNewFiles(Array.from(e.target.files));
        }
    };
    fileInput?.addEventListener('change', onFileInputChange);

    const onQualityInput = (e) => {
        const val = e.target.value;
        if (qualityVal) qualityVal.innerText = `${val}%`;
        
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => {
            if (currentFiles.length > 0) processAllFiles();
        }, 200);
    };
    qualityRange?.addEventListener('input', onQualityInput);

    function handleNewFiles(files) {
        currentFiles = files;
        processAllFiles();
    }

    function processAllFiles() {
        purgeMemory();
        if (resultsContainer) resultsContainer.innerHTML = '';
        let validImagesCount = 0;

        currentFiles.forEach(file => {
            if (!file.type.startsWith('image/')) {
                showToast(`File "${file.name}" is not a valid image.`, true);
                return;
            }
            if (file.size === 0) {
                showToast(`File "${file.name}" is empty.`, true);
                return;
            }
            validImagesCount++;
            compressImage(file);
        });

        if (validImagesCount > 0) {
            showToast(`Processing ${validImagesCount} image(s)...`);
        }
    }

    function formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function compressImage(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                try {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');

                    const targetType = file.type === 'image/png' ? 'image/png' : (file.type === 'image/webp' ? 'image/webp' : 'image/jpeg');

                    if (targetType === 'image/jpeg') {
                        ctx.fillStyle = '#FFFFFF';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                    } else {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                    }

                    ctx.drawImage(img, 0, 0);

                    const quality = parseFloat(qualityRange?.value || 75) / 100;

                    canvas.toBlob((blob) => {
                        if (!blob) {
                            showToast(`Failed to compress ${file.name}`, true);
                            return;
                        }

                        const url = URL.createObjectURL(blob);
                        activeUrls.push(url);

                        const savedPercent = Math.round(((file.size - blob.size) / file.size) * 100);
                        const isSaved = savedPercent > 0;
                        const savingsLabel = isSaved ? `-${savedPercent}%` : (savedPercent === 0 ? '0%' : `+${Math.abs(savedPercent)}%`);

                        const extMatch = file.name.match(/\.([^/.]+)$/);
                        const ext = extMatch ? extMatch[1] : (targetType === 'image/png' ? 'png' : 'jpg');
                        const baseName = file.name.replace(/\.[^/.]+$/, "");
                        const downloadName = `compressed_${baseName}.${ext}`;

                        const item = document.createElement('div');
                        item.className = 'result-item';
                        item.innerHTML = `
                            <div class="result-info">
                                <div class="result-name">${file.name}</div>
                                <div class="result-meta">
                                    ${formatBytes(file.size)} → ${formatBytes(blob.size)}
                                    <span class="badge ${!isSaved ? 'negative' : ''}">(${savingsLabel})</span>
                                </div>
                            </div>
                            <a href="${url}" download="${downloadName}" class="download-btn">Download</a>
                        `;
                        resultsContainer?.appendChild(item);
                    }, targetType, quality);
                } catch (err) {
                    showToast(`Error compressing ${file.name}`, true);
                }
            };
            img.onerror = () => showToast(`Could not load ${file.name}`, true);
            img.src = e.target.result;
        };
        reader.onerror = () => showToast(`Failed to read file ${file.name}`, true);
        reader.readAsDataURL(file);
    }

    return () => {
        purgeMemory();
        clearTimeout(debounceTimer);
        dropzone?.removeEventListener('click', onDropzoneClick);
        dropzone?.removeEventListener('dragenter', onDragOver);
        dropzone?.removeEventListener('dragover', onDragOver);
        dropzone?.removeEventListener('dragleave', onDragLeave);
        dropzone?.removeEventListener('drop', onDrop);
        fileInput?.removeEventListener('change', onFileInputChange);
        qualityRange?.removeEventListener('input', onQualityInput);
        if (window.Atelier?.setPasteHandler) {
            window.Atelier.setPasteHandler(null);
        }
    };
}
