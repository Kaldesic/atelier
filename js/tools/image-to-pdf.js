// js/tools/image-to-pdf.js
export const html = `
    <h1>Image to PDF Document Packager</h1>
    <p class="subtitle">Combine JPG, PNG, and WebP images into a clean, multi-page PDF document 100% locally in your browser.</p>

    <div class="tool-section">
        <!-- File Upload Zone -->
        <div class="drop-zone" id="pdfDropZone">
            <div class="drop-zone-icon">📑</div>
            <div class="drop-zone-text">Drop images here or <span class="browse-link">browse</span></div>
            <div class="drop-zone-sub">Supports multiple JPG, PNG, WebP files • Batch packaging</div>
            <input type="file" id="pdfFileInput" multiple accept="image/jpeg,image/png,image/webp" style="display: none;">
        </div>

        <!-- Page Configuration Settings -->
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; margin-top: 1.5rem; margin-bottom: 1.5rem;">
            <div class="input-group" style="margin-bottom: 0;">
                <label for="pdfPageSize" class="input-label">Page Format</label>
                <select id="pdfPageSize" class="input-field" style="height: 40px;">
                    <option value="a4" selected>Standard A4</option>
                    <option value="letter">US Letter</option>
                    <option value="fit">Auto-Fit to Image</option>
                </select>
            </div>

            <div class="input-group" style="margin-bottom: 0;">
                <label for="pdfOrientation" class="input-label">Orientation</label>
                <select id="pdfOrientation" class="input-field" style="height: 40px;">
                    <option value="auto" selected>Auto (Based on Image)</option>
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                </select>
            </div>

            <div class="input-group" style="margin-bottom: 0;">
                <label for="pdfMargin" class="input-label">Page Margins</label>
                <select id="pdfMargin" class="input-field" style="height: 40px;">
                    <option value="0" selected>No Margins (0mm)</option>
                    <option value="15">Small (5mm)</option>
                    <option value="30">Standard (10mm)</option>
                </select>
            </div>

            <div class="input-group" style="margin-bottom: 0;">
                <label for="pdfQuality" class="input-label">Image Compression</label>
                <select id="pdfQuality" class="input-field" style="height: 40px;">
                    <option value="0.92" selected>High Quality (92%)</option>
                    <option value="0.80">Medium Balanced (80%)</option>
                    <option value="0.65">Compact Size (65%)</option>
                </select>
            </div>
        </div>

        <!-- Image Reordering Queue Area -->
        <div id="pdfQueueSection" style="display: none;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem;">
                <div style="font-size: 0.9rem; font-weight: 600; color: var(--text);">Pages in PDF (<span id="pdfPageCount">0</span>)</div>
                <button class="btn btn-outline" id="clearAllPdfBtn" style="padding: 0.25rem 0.6rem; font-size: 0.75rem; color: var(--error);">Clear All</button>
            </div>

            <div id="pdfQueueList" style="display: flex; flex-direction: column; gap: 0.6rem; margin-bottom: 1.5rem;"></div>

            <button class="btn btn-primary" id="generatePdfBtn" style="width: 100%; padding: 0.75rem; font-size: 1rem;">🚀 Compile & Download PDF Document</button>
        </div>
    </div>
`;

export function init() {
    const dropZone = document.getElementById('pdfDropZone');
    const fileInput = document.getElementById('pdfFileInput');
    const pdfPageSize = document.getElementById('pdfPageSize');
    const pdfOrientation = document.getElementById('pdfOrientation');
    const pdfMargin = document.getElementById('pdfMargin');
    const pdfQuality = document.getElementById('pdfQuality');
    const pdfQueueSection = document.getElementById('pdfQueueSection');
    const pdfPageCount = document.getElementById('pdfPageCount');
    const pdfQueueList = document.getElementById('pdfQueueList');
    const clearAllPdfBtn = document.getElementById('clearAllPdfBtn');
    const generatePdfBtn = document.getElementById('generatePdfBtn');

    let imagesQueue = [];

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

    fileInput.addEventListener('change', (e) => handleFiles(e.target.files));

    function handleFiles(files) {
        if (!files || files.length === 0) return;
        const validFiles = Array.from(files).filter(f => f.type.startsWith('image/'));

        if (validFiles.length === 0) {
            window.Atelier.showToast('Please upload valid image files (JPG, PNG, WebP)', 'error');
            return;
        }

        let loadedCount = 0;
        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    imagesQueue.push({
                        id: Math.random().toString(36).substring(2, 9),
                        name: file.name,
                        size: (file.size / 1024).toFixed(1) + ' KB',
                        width: img.naturalWidth,
                        height: img.naturalHeight,
                        imgElement: img,
                        dataUrl: e.target.result
                    });
                    loadedCount++;
                    if (loadedCount === validFiles.length) {
                        renderQueue();
                    }
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        });
    }

    function renderQueue() {
        if (imagesQueue.length === 0) {
            pdfQueueSection.style.display = 'none';
            return;
        }

        pdfQueueSection.style.display = 'block';
        pdfPageCount.innerText = imagesQueue.length;

        pdfQueueList.innerHTML = imagesQueue.map((item, idx) => `
            <div style="display: flex; align-items: center; justify-content: space-between; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 0.6rem 0.85rem; gap: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.85rem; overflow: hidden;">
                    <span style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--text-muted); width: 24px;">#${idx + 1}</span>
                    <img src="${item.dataUrl}" style="width: 44px; height: 44px; object-fit: cover; border-radius: 4px; border: 1px solid var(--border);">
                    <div style="overflow: hidden;">
                        <div style="font-size: 0.85rem; font-weight: 500; color: var(--text); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 200px;">${item.name}</div>
                        <div style="font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono);">${item.width}×${item.height}px • ${item.size}</div>
                    </div>
                </div>

                <div style="display: flex; gap: 0.4rem; align-items: center;">
                    <button class="btn btn-outline pdf-move-btn" data-dir="up" data-idx="${idx}" ${idx === 0 ? 'disabled style="opacity:0.3;"' : ''} style="padding: 0.2rem 0.5rem; font-size: 0.75rem;">▲</button>
                    <button class="btn btn-outline pdf-move-btn" data-dir="down" data-idx="${idx}" ${idx === imagesQueue.length - 1 ? 'disabled style="opacity:0.3;"' : ''} style="padding: 0.2rem 0.5rem; font-size: 0.75rem;">▼</button>
                    <button class="btn btn-outline pdf-del-btn" data-idx="${idx}" style="padding: 0.2rem 0.5rem; font-size: 0.75rem; color: var(--error);">✕</button>
                </div>
            </div>
        `).join('');

        // Attach listeners
        pdfQueueList.querySelectorAll('.pdf-move-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
                const dir = e.currentTarget.getAttribute('data-dir');
                if (dir === 'up' && idx > 0) {
                    const temp = imagesQueue[idx];
                    imagesQueue[idx] = imagesQueue[idx - 1];
                    imagesQueue[idx - 1] = temp;
                } else if (dir === 'down' && idx < imagesQueue.length - 1) {
                    const temp = imagesQueue[idx];
                    imagesQueue[idx] = imagesQueue[idx + 1];
                    imagesQueue[idx + 1] = temp;
                }
                renderQueue();
            });
        });

        pdfQueueList.querySelectorAll('.pdf-del-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idx = parseInt(e.currentTarget.getAttribute('data-idx'), 10);
                imagesQueue.splice(idx, 1);
                renderQueue();
            });
        });
    }

    clearAllPdfBtn.addEventListener('click', () => {
        imagesQueue = [];
        renderQueue();
    });

    // In-Browser PDF Builder Engine
    // Compiles JPEG/PNG raster buffers directly into standard valid PDF 1.4 streams
    async function compilePdf() {
        if (imagesQueue.length === 0) return;

        window.Atelier.showToast('Compiling PDF document...', 'info');

        const quality = parseFloat(pdfQuality.value) || 0.92;
        const marginPts = parseInt(pdfMargin.value, 10) || 0;
        const pageSize = pdfPageSize.value;
        const orient = pdfOrientation.value;

        // Standard point dimensions (72 points = 1 inch)
        // A4: 595.28 x 841.89 pt
        // Letter: 612 x 792 pt
        const PAGE_SPECS = {
            a4: { w: 595.28, h: 841.89 },
            letter: { w: 612, h: 792 }
        };

        const pagesData = [];

        for (const item of imagesQueue) {
            const canvas = document.createElement('canvas');
            canvas.width = item.imgElement.naturalWidth;
            canvas.height = item.imgElement.naturalHeight;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(item.imgElement, 0, 0);

            // Compress to JPEG for compact clean PDF embedding
            const jpegDataUrl = canvas.toDataURL('image/jpeg', quality);
            const rawBytes = atob(jpegDataUrl.split(',')[1]);

            let pageWidth, pageHeight;

            if (pageSize === 'fit') {
                pageWidth = canvas.width;
                pageHeight = canvas.height;
            } else {
                const spec = PAGE_SPECS[pageSize] || PAGE_SPECS.a4;
                let isLandscape = false;
                if (orient === 'landscape') isLandscape = true;
                else if (orient === 'auto' && canvas.width > canvas.height) isLandscape = true;

                pageWidth = isLandscape ? spec.h : spec.w;
                pageHeight = isLandscape ? spec.w : spec.h;
            }

            // Calculate scaled image position inside page with margins
            const availW = pageWidth - marginPts * 2;
            const availH = pageHeight - marginPts * 2;
            const imgAspect = canvas.width / canvas.height;
            const pageAspect = availW / availH;

            let drawW, drawH;
            if (imgAspect > pageAspect) {
                drawW = availW;
                drawH = availW / imgAspect;
            } else {
                drawH = availH;
                drawW = availH * imgAspect;
            }

            const drawX = marginPts + (availW - drawW) / 2;
            const drawY = marginPts + (availH - drawH) / 2;

            pagesData.push({
                rawBytes: rawBytes,
                imgW: canvas.width,
                imgH: canvas.height,
                pageW: pageWidth,
                pageH: pageHeight,
                drawX: drawX,
                drawY: drawY,
                drawW: drawW,
                drawH: drawH
            });
        }

        // Build valid standard PDF 1.4 binary structure
        const binaryChunks = [];
        let offset = 0;
        const xrefOffsets = [];

        function writeString(str) {
            const arr = new Uint8Array(str.length);
            for (let i = 0; i < str.length; i++) {
                arr[i] = str.charCodeAt(i);
            }
            binaryChunks.push(arr);
            offset += arr.length;
        }

        function writeBytes(rawStr) {
            const arr = new Uint8Array(rawStr.length);
            for (let i = 0; i < rawStr.length; i++) {
                arr[i] = rawStr.charCodeAt(i);
            }
            binaryChunks.push(arr);
            offset += arr.length;
        }

        writeString("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");

        // Object ID management
        // 1: Catalog
        // 2: Outlines
        // 3: Pages
        // For each page:
        //   4 + i*3: Page Object
        //   5 + i*3: Content Stream
        //   6 + i*3: Image XObject

        const numPages = pagesData.length;
        const pageObjIds = [];

        for (let i = 0; i < numPages; i++) {
            pageObjIds.push(4 + i * 3);
        }

        // 1 0 obj - Catalog
        xrefOffsets[1] = offset;
        writeString(`1 0 obj\n<< /Type /Catalog /Pages 3 0 R >>\nendobj\n`);

        // 2 0 obj - Outlines
        xrefOffsets[2] = offset;
        writeString(`2 0 obj\n<< /Type /Outlines /Count 0 >>\nendobj\n`);

        // 3 0 obj - Pages
        xrefOffsets[3] = offset;
        writeString(`3 0 obj\n<< /Type /Pages /Kids [${pageObjIds.map(id => `${id} 0 R`).join(' ')}] /Count ${numPages} >>\nendobj\n`);

        for (let i = 0; i < numPages; i++) {
            const page = pagesData[i];
            const pageId = 4 + i * 3;
            const contentId = 5 + i * 3;
            const imageId = 6 + i * 3;

            // Page Object
            xrefOffsets[pageId] = offset;
            writeString(`${pageId} 0 obj\n<< /Type /Page /Parent 3 0 R /MediaBox [0 0 ${page.pageW.toFixed(2)} ${page.pageH.toFixed(2)}] /Contents ${contentId} 0 R /Resources << /XObject << /Im${i+1} ${imageId} 0 R >> /ProcSet [/PDF /ImageC] >> >>\nendobj\n`);

            // Content Stream (places image)
            // PDF coordinates start from bottom-left
            const streamContent = `q\n${page.drawW.toFixed(2)} 0 0 ${page.drawH.toFixed(2)} ${page.drawX.toFixed(2)} ${(page.pageH - page.drawY - page.drawH).toFixed(2)} cm\n/Im${i+1} Do\nQ\n`;
            
            xrefOffsets[contentId] = offset;
            writeString(`${contentId} 0 obj\n<< /Length ${streamContent.length} >>\nstream\n${streamContent}endstream\nendobj\n`);

            // Image XObject
            xrefOffsets[imageId] = offset;
            writeString(`${imageId} 0 obj\n<< /Type /XObject /Subtype /Image /Width ${page.imgW} /Height ${page.imgH} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${page.rawBytes.length} >>\nstream\n`);
            writeBytes(page.rawBytes);
            writeString(`\nendstream\nendobj\n`);
        }

        // XRef Table
        const startXref = offset;
        const totalObjects = 4 + numPages * 3;
        writeString(`xref\n0 ${totalObjects}\n0000000000 65535 f \n`);
        for (let i = 1; i < totalObjects; i++) {
            const off = xrefOffsets[i] || 0;
            writeString(`${off.toString().padStart(10, '0')} 00000 n \n`);
        }

        // Trailer
        writeString(`trailer\n<< /Size ${totalObjects} /Root 1 0 R >>\nstartxref\n${startXref}\n%%EOF\n`);

        const pdfBlob = new Blob(binaryChunks, { type: 'application/pdf' });
        const link = document.createElement('a');
        link.download = `atelier_document_${Date.now()}.pdf`;
        link.href = URL.createObjectURL(pdfBlob);
        link.click();

        window.Atelier.showToast(`Successfully packaged ${numPages} page${numPages === 1 ? '' : 's'} to PDF!`, 'success');
    }

    generatePdfBtn.addEventListener('click', compilePdf);
}
