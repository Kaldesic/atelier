export const html = `<h1>Image Compressor</h1>
        <p class="subtitle">Reduce JPEG and PNG file sizes with custom quality options directly in your browser.</p>

        <div class="controls">
            <label>
                <span>Compression Quality</span>
                <span id="qualityVal">75%</span>
            </label>
            <input type="range" id="qualityRange" min="10" max="100" value="75">
        </div>

        <div class="dropzone" id="dropzone" onclick="document.getElementById('fileInput').click()">
            <p>Upload images (JPG, PNG) or drag & drop here</p>
            <input type="file" id="fileInput" accept="image/jpeg, image/png, image/webp" multiple>
        </div>

        <div class="results" id="results"></div>`;

export function init() {
window.Atelier.setPasteHandler((e) => {
            const item = Array.from(e.clipboardData.items).find(i => i.type.startsWith('image/'));
            if (item) {
                const file = item.getAsFile();
                handleFiles([file]);
            }
        });
        
        let activeUrls = [];
        function purgeMemory() {
            activeUrls.forEach(url => URL.revokeObjectURL(url));
            activeUrls = [];
        }

        const fileInput = document.getElementById('fileInput');
        const resultsContainer = document.getElementById('results');
        const dropzone = document.getElementById('dropzone');
        const qualityRange = document.getElementById('qualityRange');
        const qualityVal = document.getElementById('qualityVal');

        let currentFiles = [];

        function showToast(message, isError = false) {
            window.Atelier.showToast(message, isError ? 'error' : 'success');
        }

        // Drag & Drop visual feedback
        ['dragenter', 'dragover'].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.add('drag-over');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.remove('drag-over');
            });
        });

        qualityRange.addEventListener('input', (e) => {
            qualityVal.innerText = `${e.target.value}%`;
            if (currentFiles.length > 0) processAllFiles();
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                currentFiles = Array.from(e.target.files);
                processAllFiles();
            }
        });

        dropzone.addEventListener('drop', (e) => {
            if (e.dataTransfer.files.length > 0) {
                currentFiles = Array.from(e.dataTransfer.files);
                processAllFiles();
            }
        });

        function processAllFiles() {
            resultsContainer.innerHTML = '';
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

                        // Fill white background for transparent PNGs converted to JPEG
                        ctx.fillStyle = '#FFFFFF';
                        ctx.fillRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(img, 0, 0);

                        const quality = parseFloat(qualityRange.value) / 100;
                        
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

                            const item = document.createElement('div');
                            item.className = 'result-item';
                            item.innerHTML = `
                                <div class="file-info">
                                    <div class="file-name">${file.name}</div>
                                    <div class="file-stats">
                                        ${formatBytes(file.size)} → ${formatBytes(blob.size)}
                                        <span class="savings ${!isSaved ? 'negative' : ''}">(${savingsLabel})</span>
                                    </div>
                                </div>
                                <a href="${url}" download="compressed_${file.name.replace(/\.[^/.]+$/, "")}.jpg" class="download-btn">Download</a>
                            `;
                            resultsContainer.appendChild(item);
                        }, 'image/jpeg', quality);
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
        
        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('../sw.js') 
                    .then(reg => console.log('PWA Ready:', reg.scope))
                    .catch(err => console.error('SW registration failed:', err));
            });
        }
}