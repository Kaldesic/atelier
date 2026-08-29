// js/tools/color-palette-extractor.js
export const html = `
    <h1>Color Palette Extractor</h1>
    <p class="subtitle">Extract dominant color palettes and HEX/RGB codes from any image instantly.</p>

    <div class="dropzone" id="dropzone" onclick="document.getElementById('fileInput').click()">
        <p>Upload an image (PNG, JPG, WebP), paste from clipboard, or drag & drop here</p>
        <input type="file" id="fileInput" accept="image/*" style="display: none;">
    </div>

    <div class="preview-container" id="previewContainer" style="display: none; margin-top: 1.5rem; flex-direction: column; gap: 1.5rem;">
        <img id="imgPreview" class="image-preview" alt="Uploaded Preview" style="max-height: 350px; object-fit: contain; border-radius: 8px;">
        <div class="palette-grid" id="paletteGrid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 1rem;"></div>
    </div>
`;

export function init() {
    window.Atelier?.setPasteHandler((e) => {
        const item = Array.from(e.clipboardData.items).find(i => i.type.startsWith('image/'));
        if (item) {
            const file = item.getAsFile();
            processImage(file);
        }
    });

    const fileInput = document.getElementById('fileInput');
    const dropzone = document.getElementById('dropzone');
    const previewContainer = document.getElementById('previewContainer');
    const imgPreview = document.getElementById('imgPreview');
    const paletteGrid = document.getElementById('paletteGrid');

    function showToast(message, isError = false) {
        window.Atelier?.showToast(message, isError ? 'error' : 'success');
    }

    // Drag & Drop handlers
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
        
        // Scale down image for ultra-fast and normalized color sampling
        canvas.width = 120;
        canvas.height = 120;
        ctx.drawImage(img, 0, 0, 120, 120);

        const imageData = ctx.getImageData(0, 0, 120, 120).data;
        const colorClusters = {};
        const step = 4; // Check every pixel on reduced resolution

        let totalValidPixels = 0;

        for (let i = 0; i < imageData.length; i += step * 4) {
            const r = imageData[i];
            const g = imageData[i + 1];
            const b = imageData[i + 2];
            const a = imageData[i + 3];

            if (a < 128) continue; // Ignore transparent pixels
            totalValidPixels++;

            // Quantize to bins of 16 (prevents 256 overflow: Math.floor(v / 16) * 16)
            const qR = Math.min(240, Math.floor(r / 16) * 16);
            const qG = Math.min(240, Math.floor(g / 16) * 16);
            const qB = Math.min(240, Math.floor(b / 16) * 16);

            const key = `${qR},${qG},${qB}`;

            if (!colorClusters[key]) {
                colorClusters[key] = { count: 0, rSum: 0, gSum: 0, bSum: 0 };
            }

            // Accumulate exact RGB values to average them out later
            colorClusters[key].count++;
            colorClusters[key].rSum += r;
            colorClusters[key].gSum += g;
            colorClusters[key].bSum += b;
        }

        // Sort by pixel count descending
        const sortedKeys = Object.keys(colorClusters).sort(
            (a, b) => colorClusters[b].count - colorClusters[a].count
        );

        const finalColors = [];
        const minPixelThreshold = totalValidPixels * 0.015; // Ignore colors representing < 1.5% of the image

        for (const key of sortedKeys) {
            const cluster = colorClusters[key];

            // If a color is just background noise/compression artifact, drop it
            if (cluster.count < minPixelThreshold && finalColors.length >= 2) {
                continue;
            }

            // Calculate actual average RGB of the cluster instead of raw quantized values
            const avgR = Math.round(cluster.rSum / cluster.count);
            const avgG = Math.round(cluster.gSum / cluster.count);
            const avgB = Math.round(cluster.bSum / cluster.count);

            // Distance check to avoid returning duplicate/near-identical shades
            const isTooSimilar = finalColors.some(c => {
                const dist = Math.hypot(c.r - avgR, c.g - avgG, c.b - avgB);
                return dist < 32; // Color distance threshold
            });

            if (!isTooSimilar) {
                finalColors.push({ r: avgR, g: avgG, b: avgB });
            }

            if (finalColors.length >= 6) break;
        }

        renderPalette(finalColors);
    }

    function renderPalette(colors) {
        paletteGrid.innerHTML = '';
        colors.forEach(({ r, g, b }) => {
            const hex = rgbToHex(r, g, b);

            const card = document.createElement('div');
            card.className = 'color-card';
            card.style.cursor = 'pointer';
            card.onclick = () => copyToClipboard(hex);
            card.innerHTML = `
                <div class="color-swatch" style="background-color: ${hex}; height: 80px; border-radius: 6px 6px 0 0;"></div>
                <div class="color-info" style="padding: 0.6rem; background: var(--card-bg, #1a1d24); border-radius: 0 0 6px 6px;">
                    <div class="color-hex" style="font-family: var(--font-mono); font-weight: 700; font-size: 0.85rem;">${hex}</div>
                    <div class="color-rgb" style="font-family: var(--font-mono); font-size: 0.75rem; color: var(--text-muted);">${r}, ${g}, ${b}</div>
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
