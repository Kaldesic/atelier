export const html = `<h1>WebP Converter</h1>
        <p class="subtitle">Convert PNG and JPEG images to optimized WebP format locally in your browser.</p>

        <div class="dropzone" id="dropzone" onclick="document.getElementById('fileInput').click()">
            <p>Click here to select images or drag & drop them here</p>
            <input type="file" id="fileInput" accept="image/png, image/jpeg, image/jpg, image/webp" multiple>
        </div>

        <div class="controls-card">
            <label for="qualitySlider">Output Quality</label>
            <div class="quality-slider-group">
                <input type="range" id="qualitySlider" min="10" max="100" value="85">
                <span class="quality-value" id="qualityVal">85%</span>
            </div>
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
        const dropzone = document.getElementById('dropzone');
        const resultsContainer = document.getElementById('results');
        const qualitySlider = document.getElementById('qualitySlider');
        const qualityVal = document.getElementById('qualityVal');

        function showToast(message, isError = false) {
            window.Atelier.showToast(message, isError ? 'error' : 'success');
        }

        qualitySlider.addEventListener('input', (e) => {
            qualityVal.innerText = `${e.target.value}%`;
        });

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

        dropzone.addEventListener('drop', (e) => handleFiles(e.dataTransfer.files));

        function handleFiles(files) {
            purgeMemory();
            if (!files || files.length === 0) return;
            
            let validFilesCount = 0;
            for (const file of files) {
                if (!file.type.startsWith('image/')) continue;
                validFilesCount++;
                convertImage(file, parseFloat(qualitySlider.value) / 100);
            }

            if (validFilesCount === 0) {
                showToast('Please select valid image files.', true);
            } else {
                showToast(`Processing ${validFilesCount} image(s)...`);
            }
        }

        function convertImage(file, quality) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const img = new Image();
                img.onload = function() {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);

                    canvas.toBlob((blob) => {
                        if (!blob) {
                            showToast(`Failed to convert ${file.name}`, true);
                            return;
                        }

                        const url = URL.createObjectURL(blob);
                            activeUrls.push(url);
                        const originalName = file.name.replace(/\.[^/.]+$/, "");
                        const newFileName = `${originalName}.webp`;
                        
                        const originalKB = (file.size / 1024).toFixed(1);
                        const newKB = (blob.size / 1024).toFixed(1);
                        const savedPct = file.size > 0 ? (((file.size - blob.size) / file.size) * 100).toFixed(1) : 0;

                        const item = document.createElement('div');
                        item.className = 'result-item';
                        
                        const fileInfo = document.createElement('div');
                        fileInfo.className = 'file-info';

                        const fileNameDiv = document.createElement('div');
                        fileNameDiv.className = 'file-name';
                        fileNameDiv.textContent = newFileName;

                        const fileSizeDiv = document.createElement('div');
                        fileSizeDiv.className = 'file-size';
                        fileSizeDiv.innerHTML = `${originalKB} KB → ${newKB} KB ${savedPct > 0 ? `<span class="badge-saving">(${savedPct}% saved)</span>` : ''}`;

                        fileInfo.appendChild(fileNameDiv);
                        fileInfo.appendChild(fileSizeDiv);

                        const downloadAnchor = document.createElement('a');
                        downloadAnchor.href = url;
                        downloadAnchor.download = newFileName;
                        downloadAnchor.className = 'download-btn';
                        downloadAnchor.textContent = 'Download';

                        item.appendChild(fileInfo);
                        item.appendChild(downloadAnchor);
                        
                        resultsContainer.prepend(item);
                    }, 'image/webp', quality);
                };
                img.onerror = () => showToast(`Error loading image: ${file.name}`, true);
                img.src = event.target.result;
            };
            reader.onerror = () => showToast(`Error reading file: ${file.name}`, true);
            reader.readAsDataURL(file);
        }
        
        
}
