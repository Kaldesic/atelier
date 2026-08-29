// js/tools/batch-processor.js
export const html = `
    <h1>Batch Image & File Processor</h1>
    <p class="subtitle">Process, convert, resize, rename, and package hundreds of images into a single ZIP file client-side.</p>

    <div class="tool-section">
        <div class="drop-zone" id="batchDropZone">
            <div class="drop-zone-icon">📦</div>
            <div class="drop-zone-text">Drop multiple images here or <span class="browse-link">browse</span></div>
            <div class="drop-zone-sub">Supports JPG, PNG, WebP, GIF, SVG • Bulk conversion, resizing & ZIP packaging</div>
            <input type="file" id="batchFileInput" multiple accept="image/*" style="display: none;">
        </div>

        <div style="background: var(--bg); border: 1px solid var(--border); border-radius: 12px; padding: 1.25rem; margin-top: 1.5rem; margin-bottom: 1.5rem;">
            <div style="font-size: 0.95rem; font-weight: 600; margin-bottom: 1rem; color: var(--text); display: flex; align-items: center; gap: 0.5rem;">
                <span>⚙️</span> Batch Processing Rules
            </div>

            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
                <div class="input-group" style="margin-bottom: 0;">
                    <label for="batchTargetFormat" class="input-label">Target Format</label>
                    <select id="batchTargetFormat" class="input-field" style="height: 40px;">
                        <option value="keep" selected>Original Format (No Conversion)</option>
                        <option value="image/webp">Convert to WebP (.webp)</option>
                        <option value="image/jpeg">Convert to JPEG (.jpg)</option>
                        <option value="image/png">Convert to PNG (.png)</option>
                    </select>
                </div>

                <div class="input-group" style="margin-bottom: 0;">
                    <label for="batchQuality" class="input-label">Output Quality: <span id="batchQualityVal">85%</span></label>
                    <input type="range" id="batchQuality" min="10" max="100" value="85" style="width: 100%; margin-top: 0.5rem;">
                </div>

                <div class="input-group" style="margin-bottom: 0;">
                    <label for="batchResizeMode" class="input-label">Batch Resizing</label>
                    <select id="batchResizeMode" class="input-field" style="height: 40px;">
                        <option value="none" selected>Original Dimensions</option>
                        <option value="scale">Scale by Percentage (%)</option>
                        <option value="max-width">Max Width Constraint (px)</option>
                        <option value="max-height">Max Height Constraint (px)</option>
                    </select>
                </div>

                <div class="input-group" id="batchResizeValueGroup" style="margin-bottom: 0; display: none;">
                    <label for="batchResizeValue" class="input-label" id="batchResizeValueLabel">Scale (%)</label>
                    <input type="number" id="batchResizeValue" class="input-field" value="50" min="1" max="10000" style="height: 40px;">
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--border);">
                <div class="input-group" style="margin-bottom: 0;">
                    <label for="batchPrefix" class="input-label">Add Prefix to Filename</label>
                    <input type="text" id="batchPrefix" class="input-field" placeholder="e.g. optimized_ or thumb_" style="height: 38px;">
                </div>
                <div class="input-group" style="margin-bottom: 0;">
                    <label for="batchSuffix" class="input-label">Add Suffix to Filename</label>
                    <input type="text" id="batchSuffix" class="input-field" placeholder="e.g. _min or _compressed" style="height: 38px;">
                </div>
            </div>
        </div>

        <div id="batchQueueSection" style="display: none;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
                <div style="font-size: 0.95rem; font-weight: 600; color: var(--text);">
                    Files in Queue: <span id="batchCountBadge" style="color: var(--accent);">0</span>
                    <span id="batchTotalOriginalSize" style="font-size: 0.8rem; color: var(--text-muted); font-weight: 400; margin-left: 0.5rem;">(0 MB total)</span>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button class="btn btn-outline" id="clearAllBatchBtn" style="padding: 0.3rem 0.75rem; font-size: 0.8rem; color: var(--error);">Clear All</button>
                </div>
            </div>

            <div id="batchFilesList" style="display: flex; flex-direction: column; gap: 0.5rem; max-height: 420px; overflow-y: auto; margin-bottom: 1.5rem; padding-right: 4px;"></div>

            <div id="batchProgressBarWrapper" style="display: none; margin-bottom: 1.25rem;">
                <div style="display: flex; justify-content: space-between; font-size: 0.8rem; margin-bottom: 0.4rem; color: var(--text-muted);">
                    <span id="batchProgressStatus">Processing items...</span>
                    <span id="batchProgressPercent">0%</span>
                </div>
                <div style="background: var(--bg); border-radius: 6px; height: 8px; overflow: hidden; border: 1px solid var(--border);">
                    <div id="batchProgressBar" style="width: 0%; height: 100%; background: var(--accent); transition: width 0.15s ease;"></div>
                </div>
            </div>

            <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <button class="btn btn-primary" id="runBatchZipBtn" style="flex: 2; padding: 0.85rem; font-size: 1rem; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
                    <span>⚡</span> Process & Download ZIP Archive
                </button>
            </div>
        </div>
    </div>
`;

export function init() {
    const dropZone = document.getElementById('batchDropZone');
    const fileInput = document.getElementById('batchFileInput');
    const targetFormat = document.getElementById('batchTargetFormat');
    const qualitySlider = document.getElementById('batchQuality');
    const qualityVal = document.getElementById('batchQualityVal');
    const resizeMode = document.getElementById('batchResizeMode');
    const resizeValueGroup = document.getElementById('batchResizeValueGroup');
    const resizeValueLabel = document.getElementById('batchResizeValueLabel');
    const resizeValue = document.getElementById('batchResizeValue');
    const prefixInput = document.getElementById('batchPrefix');
    const suffixInput = document.getElementById('batchSuffix');

    const queueSection = document.getElementById('batchQueueSection');
    const countBadge = document.getElementById('batchCountBadge');
    const totalOriginalSizeEl = document.getElementById('batchTotalOriginalSize');
    const filesList = document.getElementById('batchFilesList');
    const clearAllBtn = document.getElementById('clearAllBatchBtn');
    const runBatchZipBtn = document.getElementById('runBatchZipBtn');

    const progressBarWrapper = document.getElementById('batchProgressBarWrapper');
    const progressBar = document.getElementById('batchProgressBar');
    const progressStatus = document.getElementById('batchProgressStatus');
    const progressPercent = document.getElementById('batchProgressPercent');

    let batchItems = [];

    // Dropzone listeners
    dropZone.addEventListener('click', () => fileInput.click());
    dropZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropZone.classList.add('drag-over');
    });
    dropZone.addEventListener('dragleave', () => dropZone.classList.remove('drag-over'));
    dropZone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropZone.classList.remove('drag-over');
        handleFiles(e.dataTransfer.files);
    });

    // Quality slider sync
    qualitySlider.addEventListener('input', () => {
        qualityVal.innerText = qualitySlider.value + '%';
    });

    // Resize Mode toggle
    resizeMode.addEventListener('change', () => {
        const mode = resizeMode.value;
        if (mode === 'none') {
            resizeValueGroup.style.display = 'none';
        } else {
            resizeValueGroup.style.display = 'block';
            if (mode === 'scale') {
                resizeValueLabel.innerText = 'Scale Percentage (%)';
                resizeValue.value = '50';
                resizeValue.min = '1';
                resizeValue.max = '500';
            } else if (mode === 'max-width') {
                resizeValueLabel.innerText = 'Maximum Width (px)';
                resizeValue.value = '1200';
                resizeValue.min = '50';
                resizeValue.max = '10000';
            } else if (mode === 'max-height') {
                resizeValueLabel.innerText = 'Maximum Height (px)';
                resizeValue.value = '1200';
                resizeValue.min = '50';
                resizeValue.max = '10000';
            }
        }
    });

    fileInput.addEventListener('change', (e) => {
        handleFiles(e.target.files);
        fileInput.value = '';
    });

    function handleFiles(files) {
        if (!files || files.length === 0) return;

        const newFiles = Array.from(files).filter(f => f.type.startsWith('image/'));
        if (newFiles.length === 0) {
            window.Atelier?.showToast('Please select valid image files', 'error');
            return;
        }

        let loaded = 0;
        newFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    batchItems.push({
                        id: Math.random().toString(36).substring(2, 9),
                        file: file,
                        name: file.name,
                        originalSize: file.size,
                        width: img.naturalWidth,
                        height: img.naturalHeight,
                        imgElement: img,
                        dataUrl: e.target.result
                    });
                    loaded++;
                    if (loaded === newFiles.length) {
                        renderQueue();
                    }
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    function formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    function renderQueue() {
        if (batchItems.length === 0) {
            queueSection.style.display = 'none';
            return;
        }

        queueSection.style.display = 'block';
        countBadge.innerText = batchItems.length;

        const totalBytes = batchItems.reduce((acc, item) => acc + item.originalSize, 0);
        totalOriginalSizeEl.innerText = `(${formatBytes(totalBytes)} total)`;

        filesList.innerHTML = batchItems.map((item, idx) => `
            <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 0.5rem 0.85rem; gap: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.75rem; overflow: hidden;">
                    <span style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted); width: 22px;">#${idx + 1}</span>
                    <img src="${item.dataUrl}" style="width: 40px; height: 40px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border); flex-shrink: 0;">
                    <div style="overflow: hidden;">
                        <div style="font-size: 0.85rem; font-weight: 500; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 260px;">${item.name}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">${item.width}×${item.height}px • ${formatBytes(item.originalSize)}</div>
                    </div>
                </div>
                <button class="btn btn-outline batch-del-item" data-idx="${idx}" style="padding: 0.25rem 0.5rem; font-size: 0.75rem; color: var(--error);">✕</button>
            </div>
        `).join('');

        filesList.querySelectorAll('.batch-del-item').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
                batchItems.splice(idx, 1);
                renderQueue();
            });
        });
    }

    clearAllBtn.addEventListener('click', () => {
        batchItems = [];
        renderQueue();
    });

    // In-Browser High Performance Pure JS ZIP Builder Engine
    class ClientZipArchive {
        constructor() {
            this.files = [];
        }

        addFile(filename, uint8Array) {
            this.files.push({
                name: filename,
                data: uint8Array,
                crc32: this.calculateCRC32(uint8Array)
            });
        }

        calculateCRC32(buf) {
            let crc = 0 ^ (-1);
            for (let i = 0; i < buf.length; i++) {
                crc = (crc >>> 8) ^ this.getCrcTable()[(crc ^ buf[i]) & 0xFF];
            }
            return (crc ^ (-1)) >>> 0;
        }

        getCrcTable() {
            if (this.crcTable) return this.crcTable;
            let c;
            const table = [];
            for (let n = 0; n < 256; n++) {
                c = n;
                for (let k = 0; k < 8; k++) {
                    c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
                }
                table[n] = c;
            }
            this.crcTable = table;
            return table;
        }

        generateBlob() {
            const chunks = [];
            let centralDirChunks = [];
            let offset = 0;
            let centralDirSize = 0;

            const now = new Date();
            const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
            const dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();

            for (const file of this.files) {
                const nameBytes = new TextEncoder().encode(file.name);
                const fileLength = file.data.length;

                const localHeader = new Uint8Array(30 + nameBytes.length);
                const view = new DataView(localHeader.buffer);

                view.setUint32(0, 0x04034b50, true);
                view.setUint16(4, 10, true);
                view.setUint16(6, 0, true);
                view.setUint16(8, 0, true);
                view.setUint16(10, dosTime, true);
                view.setUint16(12, dosDate, true);
                view.setUint32(14, file.crc32, true);
                view.setUint32(18, fileLength, true);
                view.setUint32(22, fileLength, true);
                view.setUint16(26, nameBytes.length, true);
                view.setUint16(28, 0, true);
                localHeader.set(nameBytes, 30);

                chunks.push(localHeader);
                chunks.push(file.data);

                const centralHeader = new Uint8Array(46 + nameBytes.length);
                const cView = new DataView(centralHeader.buffer);

                cView.setUint32(0, 0x02014b50, true);
                cView.setUint16(4, 20, true);
                cView.setUint16(6, 10, true);
                cView.setUint16(8, 0, true);
                cView.setUint16(10, 0, true);
                cView.setUint16(12, dosTime, true);
                cView.setUint16(14, dosDate, true);
                cView.setUint32(16, file.crc32, true);
                cView.setUint32(20, fileLength, true);
                cView.setUint32(24, fileLength, true);
                cView.setUint16(28, nameBytes.length, true);
                cView.setUint16(30, 0, true);
                cView.setUint16(32, 0, true);
                cView.setUint16(34, 0, true);
                cView.setUint16(36, 0, true);
                cView.setUint32(38, 0, true);
                cView.setUint32(42, offset, true);
                centralHeader.set(nameBytes, 46);

                centralDirChunks.push(centralHeader);
                centralDirSize += centralHeader.length;

                offset += localHeader.length + fileLength;
            }

            const centralDirOffset = offset;

            const eocd = new Uint8Array(22);
            const eView = new DataView(eocd.buffer);
            eView.setUint32(0, 0x06054b50, true);
            eView.setUint16(4, 0, true);
            eView.setUint16(6, 0, true);
            eView.setUint16(8, this.files.length, true);
            eView.setUint16(10, this.files.length, true);
            eView.setUint32(12, centralDirSize, true);
            eView.setUint32(16, centralDirOffset, true);
            eView.setUint16(20, 0, true);

            const allBlobs = [...chunks, ...centralDirChunks, eocd];
            return new Blob(allBlobs, { type: 'application/zip' });
        }
    }

    // Helper za konverziju Platna (Canvas) u Uint8Array
    function canvasToBytes(canvas, mimeType, quality) {
        return new Promise((resolve) => {
            canvas.toBlob((blob) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(new Uint8Array(reader.result));
                reader.readAsArrayBuffer(blob);
            }, mimeType, quality);
        });
    }

    // Execution routine
    async function processBatch() {
        if (batchItems.length === 0) return;

        runBatchZipBtn.disabled = true;
        progressBarWrapper.style.display = 'block';
        progressBar.style.width = '0%';

        const zip = new ClientZipArchive();
        const targetMime = targetFormat.value;
        const quality = parseInt(qualitySlider.value, 10) / 100;
        const rMode = resizeMode.value;
        const rVal = parseFloat(resizeValue.value) || 100;
        const prefix = prefixInput.value.trim();
        const suffix = suffixInput.value.trim();

        const total = batchItems.length;

        for (let i = 0; i < total; i++) {
            const item = batchItems[i];
            const currentNum = i + 1;
            const pct = Math.round((currentNum / total) * 100);

            progressStatus.innerText = `Processing (${currentNum}/${total}): ${item.name}`;
            progressPercent.innerText = `${pct}%`;
            progressBar.style.width = `${pct}%`;

            // Calculate new dimensions
            let newW = item.width;
            let newH = item.height;

            if (rMode === 'scale') {
                const ratio = rVal / 100;
                newW = Math.round(item.width * ratio);
                newH = Math.round(item.height * ratio);
            } else if (rMode === 'max-width') {
                if (item.width > rVal) {
                    newW = Math.round(rVal);
                    newH = Math.round(item.height * (rVal / item.width));
                }
            } else if (rMode === 'max-height') {
                if (item.height > rVal) {
                    newH = Math.round(rVal);
                    newW = Math.round(item.width * (rVal / item.height));
                }
            }

            newW = Math.max(1, newW);
            newH = Math.max(1, newH);

            // Determine output MIME & extension
            let outMime = item.file.type;
            const lastDotIndex = item.name.lastIndexOf('.');
            let ext = lastDotIndex !== -1 ? item.name.split('.').pop() : 'png';
            const baseName = lastDotIndex !== -1 ? item.name.substring(0, lastDotIndex) : item.name;

            if (targetMime !== 'keep') {
                outMime = targetMime;
                if (targetMime === 'image/webp') ext = 'webp';
                else if (targetMime === 'image/jpeg') ext = 'jpg';
                else if (targetMime === 'image/png') ext = 'png';
            }

            const canvas = document.createElement('canvas');
            canvas.width = newW;
            canvas.height = newH;
            const ctx = canvas.getContext('2d');

            // Fill white background for JPEG exports
            if (outMime === 'image/jpeg') {
                ctx.fillStyle = '#FFFFFF';
                ctx.fillRect(0, 0, newW, newH);
            }

            ctx.drawImage(item.imgElement, 0, 0, newW, newH);

            // Asinhrono preuzimanje bajtova sa canvasa
            const imageBytes = await canvasToBytes(canvas, outMime, quality);

            const finalFileName = `${prefix}${baseName}${suffix}.${ext}`;
            zip.addFile(finalFileName, imageBytes);

            await new Promise(r => setTimeout(r, 10));
        }

        progressStatus.innerText = 'Creating ZIP container...';

        const zipBlob = zip.generateBlob();
        const link = document.createElement('a');
        link.download = `atelier_batch_${Date.now()}.zip`;
        link.href = URL.createObjectURL(zipBlob);
        link.click();

        window.Atelier?.showToast(`Batch completed! Saved ${total} files in ZIP.`, 'success');

        runBatchZipBtn.disabled = false;
        setTimeout(() => {
            progressBarWrapper.style.display = 'none';
        }, 1500);
    }

    runBatchZipBtn.addEventListener('click', processBatch);
}
