export const html = `<h1>EXIF Metadata Stripper</h1>
        <p class="subtitle">Strip hidden camera data, GPS coordinates, and timestamps from photos for privacy.</p>

        <div class="dropzone" id="dropzone" onclick="document.getElementById('fileInput').click()">
            <p>Upload photos (JPG, PNG, WebP) or drag & drop here</p>
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

        fileInput.addEventListener('change', (e) => handleFiles(e.target.files));
        dropzone.addEventListener('drop', (e) => {
            if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                handleFiles(e.dataTransfer.files);
            }
        });

        function handleFiles(files) {
            purgeMemory();
            if (!files || files.length === 0) return;

            resultsContainer.innerHTML = '';
            let validFiles = 0;
            let invalidFiles = 0;

            Array.from(files).forEach(file => {
                if (file.size === 0) {
                    invalidFiles++;
                    return;
                }

                if (file.type.startsWith('image/')) {
                    stripEXIF(file);
                    validFiles++;
                } else {
                    invalidFiles++;
                }
            });

            if (invalidFiles > 0 && validFiles === 0) {
                showToast('No valid image files provided.', true);
            } else if (invalidFiles > 0) {
                showToast(`Skipped ${invalidFiles} unsupported or empty file(s).`, true);
            }
        }

        function stripEXIF(file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    
                    ctx.drawImage(img, 0, 0);

                    canvas.toBlob((blob) => {
                        if (!blob) {
                            showToast(`Failed to process ${file.name}`, true);
                            return;
                        }

                        const url = URL.createObjectURL(blob);
                            activeUrls.push(url);
                        const cleanFileName = `clean_${file.name}`;

                        const item = document.createElement('div');
                        item.className = 'result-item';
                        item.innerHTML = `
                            <div class="file-info">
                                <div class="file-name">${file.name}</div>
                                <div class="file-status">✓ EXIF & GPS stripped</div>
                            </div>
                            <a href="${url}" download="${cleanFileName}" class="download-btn">Download Clean Image</a>
                        `;
                        resultsContainer.appendChild(item);
                        showToast(`Stripped metadata from ${file.name}`);
                    }, file.type || 'image/jpeg', 0.95);
                };
                img.onerror = () => showToast(`Error loading image ${file.name}`, true);
                img.src = e.target.result;
            };
            reader.onerror = () => showToast(`Error reading ${file.name}`, true);
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