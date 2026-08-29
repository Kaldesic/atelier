export const html = `
    <h1>Lorem Ipsum & Mock Data Generator</h1>
    <p class="subtitle">Quickly generate placeholder paragraphs, sentences, users, mock JSON arrays, and CSV dummy datasets.</p>

    <div class="tool-section">
        <div class="presets-bar" style="margin-bottom: 1.5rem;">
            <button class="preset-btn active" id="mode-paragraphs">Paragraphs</button>
            <button class="preset-btn" id="mode-sentences">Sentences</button>
            <button class="preset-btn" id="mode-users">Mock Users</button>
            <button class="preset-btn" id="mode-json">Mock JSON Products</button>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; margin-bottom: 1.5rem;">
            <div class="input-group" style="margin-bottom: 0;">
                <label for="loremCount" class="input-label">Count</label>
                <input type="number" id="loremCount" class="input-field" value="3" min="1" max="50" style="height: 42px;">
            </div>

            <div class="input-group" id="htmlWrapGroup" style="margin-bottom: 0;">
                <label for="wrapSelect" class="input-label">HTML Wrap</label>
                <select id="wrapSelect" class="input-field" style="height: 42px;">
                    <option value="none" selected>Plain Text</option>
                    <option value="p">&lt;p&gt; tags</option>
                    <option value="li">&lt;li&gt; tags</option>
                </select>
            </div>
        </div>

        <div style="display: flex; gap: 0.75rem; margin-bottom: 1.5rem;">
            <button class="btn btn-primary" id="generateLoremBtn" style="padding: 0.55rem 1.25rem;">🎲 Re-generate Content</button>
            <button class="btn btn-outline" id="copyLoremBtn" style="padding: 0.55rem 1.25rem;">Copy Output</button>
        </div>

        <div class="input-group" style="margin-bottom: 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                <label class="input-label" style="margin-bottom: 0;">Generated Result</label>
                <span id="loremStats" class="result-meta">0 words</span>
            </div>
            <textarea id="loremOutput" class="textarea-field" style="height: 250px; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.6;" readonly></textarea>
        </div>
    </div>
`;

export function init() {
    const modeParagraphs = document.getElementById('mode-paragraphs');
    const modeSentences = document.getElementById('mode-sentences');
    const modeUsers = document.getElementById('mode-users');
    const modeJson = document.getElementById('mode-json');
    const modeBtns = [modeParagraphs, modeSentences, modeUsers, modeJson];

    const loremCount = document.getElementById('loremCount');
    const wrapSelect = document.getElementById('wrapSelect');
    const htmlWrapGroup = document.getElementById('htmlWrapGroup');
    const generateLoremBtn = document.getElementById('generateLoremBtn');
    const copyLoremBtn = document.getElementById('copyLoremBtn');
    const loremOutput = document.getElementById('loremOutput');
    const loremStats = document.getElementById('loremStats');

    let currentMode = 'paragraphs';

    const LOREM_WORDS = [
        'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'curabitur', 'vel',
        'hendrerit', 'libero', 'eleifend', 'blandit', 'nunc', 'ornare', 'odio', 'ut', 'orci', 'gravida',
        'imperdiet', 'nullam', 'purus', 'lacinia', 'a', 'pretium', 'quis', 'congue', 'praesent', 'sagittis',
        'laoreet', 'auctor', 'mauris', 'non', 'velit', 'eros', 'dictum', 'proin', 'accumsan', 'sapien',
        'nec', 'massa', 'volutpat', 'venenatis', 'sed', 'eu', 'molestie', 'lacus', 'quisque', 'porttitor',
        'ligula', 'dapibus', 'facilisis', 'tempor', 'feugiat', 'quam', 'suspendisse', 'potenti', 'vivamus'
    ];

    const FIRST_NAMES = ['Elena', 'Marco', 'Sophia', 'Liam', 'Astrid', 'Mateo', 'Zara', 'Julian', 'Amara', 'Lucas'];
    const LAST_NAMES = ['Vance', 'Novak', 'Sterling', 'Dubois', 'Kowalski', 'Tanaka', 'Silva', 'Lindqvist', 'Mercer'];
    const ROLES = ['Frontend Architect', 'Product Designer', 'DevOps Specialist', 'Design Engineer', 'Security Lead'];
    const PRODUCTS = ['Aero Minimal Desk', 'Monolith Mechanical Keyboard', 'Prism Studio Lamp', 'Zenith Ergonomic Chair', 'Titan Audio Interface'];

    function setMode(mode, btn) {
        currentMode = mode;
        modeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (mode === 'users' || mode === 'json') {
            htmlWrapGroup.style.display = 'none';
        } else {
            htmlWrapGroup.style.display = 'block';
        }

        generate();
    }

    modeParagraphs.addEventListener('click', () => setMode('paragraphs', modeParagraphs));
    modeSentences.addEventListener('click', () => setMode('sentences', modeSentences));
    modeUsers.addEventListener('click', () => setMode('users', modeUsers));
    modeJson.addEventListener('click', () => setMode('json', modeJson));

    function getRandomSentence() {
        const count = Math.floor(Math.random() * 10) + 8;
        const words = [];
        for (let i = 0; i < count; i++) {
            words.push(LOREM_WORDS[Math.floor(Math.random() * LOREM_WORDS.length)]);
        }
        let sentence = words.join(' ');
        return sentence.charAt(0).toUpperCase() + sentence.slice(1) + '.';
    }

    function getRandomParagraph(isFirst = false) {
        const sentenceCount = Math.floor(Math.random() * 3) + 4;
        const sentences = [];
        
        for (let i = 0; i < sentenceCount; i++) {
            if (isFirst && i === 0) {
                sentences.push('Lorem ipsum dolor sit amet, consectetur adipiscing elit.');
            } else {
                sentences.push(getRandomSentence());
            }
        }
        return sentences.join(' ');
    }

    function generate() {
        const count = Math.max(1, parseInt(loremCount.value, 10) || 1);
        const wrap = wrapSelect.value;
        let result = '';

        if (currentMode === 'paragraphs') {
            const paras = [];
            for (let i = 0; i < count; i++) {
                let p = getRandomParagraph(i === 0);
                if (wrap === 'p') p = `<p>${p}</p>`;
                if (wrap === 'li') p = `<li>${p}</li>`;
                paras.push(p);
            }
            result = paras.join('\n\n');
        } else if (currentMode === 'sentences') {
            const sentences = [];
            for (let i = 0; i < count; i++) {
                let s = getRandomSentence();
                if (wrap === 'p') s = `<p>${s}</p>`;
                if (wrap === 'li') s = `<li>${s}</li>`;
                sentences.push(s);
            }
            result = sentences.join('\n');
        } else if (currentMode === 'users') {
            const users = [];
            for (let i = 0; i < count; i++) {
                const first = FIRST_NAMES[Math.floor(Math.random() * FIRST_NAMES.length)];
                const last = LAST_NAMES[Math.floor(Math.random() * LAST_NAMES.length)];
                const role = ROLES[Math.floor(Math.random() * ROLES.length)];
                users.push({
                    id: `usr_${1000 + i}`,
                    name: `${first} ${last}`,
                    email: `${first.toLowerCase()}.${last.toLowerCase()}@example.dev`,
                    role: role,
                    active: Math.random() > 0.2
                });
            }
            result = JSON.stringify(users, null, 2);
        } else if (currentMode === 'json') {
            const items = [];
            for (let i = 0; i < count; i++) {
                const title = PRODUCTS[i % PRODUCTS.length] + (i >= PRODUCTS.length ? ` ${Math.floor(i / PRODUCTS.length) + 1}` : '');
                items.push({
                    sku: `SKU-${10000 + i}`,
                    name: title,
                    price: parseFloat((Math.random() * 200 + 49).toFixed(2)),
                    currency: 'EUR',
                    inStock: Math.random() > 0.15,
                    tags: ['minimalist', 'hardware', 'crafted']
                });
            }
            result = JSON.stringify(items, null, 2);
        }

        loremOutput.value = result;

        // Metrika: čišćenje HTML tagova i JSON sintakse radi tačnog brojanja reči
        if (currentMode === 'users' || currentMode === 'json') {
            loremStats.innerText = `${count} items • ${result.length} chars`;
        } else {
            const cleanText = result.replace(/<\/?[^>]+(>|$)/g, '').trim();
            const words = cleanText ? cleanText.split(/\s+/).length : 0;
            loremStats.innerText = `${words} words • ${result.length} chars`;
        }
    }

    generateLoremBtn.addEventListener('click', () => {
        generate();
        window.Atelier?.showToast?.('Generated fresh placeholder content!', 'info');
    });

    loremCount.addEventListener('input', generate);
    wrapSelect.addEventListener('change', generate);

    copyLoremBtn.addEventListener('click', () => {
        if (!loremOutput.value) return;
        navigator.clipboard.writeText(loremOutput.value).then(() => {
            window.Atelier?.showToast?.('Copied content to clipboard!', 'success');
        });
    });

    generate();
}
