export const html = `<h1>Favicon Generator</h1>
        <p class="subtitle">Upload a logo or image to instantly generate standard web & app favicons.</p>

        <div class="dropzone" id="dropzone" onclick="document.getElementById('fileInput').click()">
            <p>Select logo image (PNG, JPG, SVG) or drag & drop here</p>
            <input type="file" id="fileInput" accept="image/png, image/jpeg, image/svg+xml" style="display: none;">
        </div>

        <div class="output-section" id="outputSection" style="display: none; margin-top: 1.5rem;">
            <div class="icons-grid" id="iconsGrid" style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;"></div>

            <div class="code-box" style="position: relative; background: var(--card-bg, #1a1d24); padding: 1rem; border-radius: 8px;">
                <div class="code-title" style="font-size: 0.8rem; font-weight: bold; color: var(--text-muted); margin-bottom: 0.5rem;">HTML HEAD TAGS</div>
                <button class="copy-btn" id="copyBtn" style="position: absolute; top: 0.75rem; right: 0.75rem; padding: 0.3rem 0.75rem;">Copy HTML</button>
                <pre id="htmlCode" style="font-family: var(--font-mono); font-size: 0.85rem; overflow-x: auto; margin: 0; white-space: pre-wrap;"></pre>
            </div>
        </div>`;

export function init() {
    window.Atelier?.setPasteHandler((e) => {
        const item = Array.from(e.clipboardData.items).find(i => i.type.startsWith('image/'));
        if (item) {
            processImage(item.getAsFile());
        }
    });

    let activeUrls = [];
    function purgeMemory() {
        activeUrls.forEach(url => URL.revokeObjectURL(url));
        activeUrls = [];
    }

    const fileInput = document.getElementById('fileInput');
    const dropzone = document.getElementById('dropzone');
    const outputSection = document.getElementById('outputSection');
    const iconsGrid = document.getElementById('iconsGrid');
    const htmlCode = document.getElementById('htmlCode');
    const copyBtn = document.getElementById('copyBtn');

    const SIZES = [
        { name: 'favicon-16x16.png', size: 16, rel: 'icon', type: 'image/png' },
        { name: 'favicon-32x32.png', size: 32, rel: 'icon', type: 'image/png' },
        { name: 'apple-touch-icon.png', size: 180, rel: 'apple-touch-icon', type: 'image/png' },
        { name: 'android-chrome-192x192.png', size: 192, rel: 'icon', type: 'image/png' },
        { name: 'android-chrome-512x512.png', size: 512, rel: 'icon', type: 'image/png' }
    ];

    function showToast(message, isError = false) {
        window.Atelier?.showToast(message, isError ? 'error' : 'success');
    }

    // Drag & Drop
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

    copyBtn.addEventListener('click', () => {
        if (!htmlCode.textContent) return;
        navigator.clipboard.writeText(htmlCode.textContent).then(() => {
            showToast('HTML tags copied to clipboard!');
        }).catch(() => {
            showToast('Failed to copy tags.', true);
        });
    });

    function processImage(file) {
        if (!file || file.size === 0) {
            showToast('Selected file is empty.', true);
            return;
        }

        if (!file.type.startsWith('image/')) {
            showToast('Please upload an image (PNG, JPG, SVG).', true);
            return;
        }

        purgeMemory();
        iconsGrid.innerHTML = '';

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                generateFavicons(img);
                outputSection.style.display = 'block';
                showToast('Favicons generated successfully!');
            };
            img.onerror = () => showToast('Failed to load image.', true);
            img.src = e.target.result;
        };
        reader.onerror = () => showToast('Failed to read file.', true);
        reader.readAsDataURL(file);
    }

    function generateFavicons(img) {
        let generatedTags = [];

        SIZES.forEach(item => {
            const canvas = document.createElement('canvas');
            canvas.width = item.size;
            canvas.height = item.size;
            const ctx = canvas.getContext('2d');

            // Smooth scaling
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, item.size, item.size);

            canvas.toBlob((blob) => {
                if (!blob) return;

                const url = URL.createObjectURL(blob);
                activeUrls.push(url);

                const card = document.createElement('div');
                card.className = 'icon-card';
                card.style.cssText = 'background: var(--card-bg, #1a1d24); padding: 1rem; border-radius: 8px; text-align: center; display: flex; flex-direction: column; align-items: center; gap: 0.5rem;';
                
                card.innerHTML = `
                    <div style="width: 48px; height: 48px; display: flex; align-items: center; justify-content: center;">
                        <img src="${url}" alt="${item.name}" style="max-width: ${Math.min(item.size, 48)}px; max-height: ${Math.min(item.size, 48)}px; object-fit: contain;">
                    </div>
                    <div style="font-size: 0.8rem; font-weight: bold;">${item.size}x${item.size}</div>
                    <a href="${url}" download="${item.name}" class="download-btn" style="font-size: 0.75rem; text-decoration: none; padding: 0.25rem 0.5rem; background: var(--accent, #3b82f6); color: white; border-radius: 4px;">Download</a>
                `;
                iconsGrid.appendChild(card);
            }, item.type);

            if (item.rel === 'apple-touch-icon') {
                generatedTags.push(`<link rel="apple-touch-icon" sizes="${item.size}x${item.size}" href="/${item.name}">`);
            } else {
                generatedTags.push(`<link rel="icon" type="${item.type}" sizes="${item.size}x${item.size}" href="/${item.name}">`);
            }
        });

        htmlCode.textContent = generatedTags.join('\n');
    }

    return purgeMemory;
}
