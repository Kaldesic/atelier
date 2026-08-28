// js/tools/text-diff-case.js
export const html = `
    <h1>Text Diff, Case Converter & Inspector</h1>
    <p class="subtitle">Compare text differences side-by-side, transform string casings, and analyze text metrics client-side.</p>

    <!-- Main Navigation Pills -->
    <div class="presets-bar" style="margin-bottom: 1.5rem;">
        <button class="preset-btn active" id="tab-diff">🔍 Text Diff Checker</button>
        <button class="preset-btn" id="tab-case">🔤 Case Converter</button>
        <button class="preset-btn" id="tab-stats">📊 String Analytics & Stats</button>
    </div>

    <!-- Section 1: Diff Checker -->
    <div id="section-diff" class="tool-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
            <div style="font-size: 0.9rem; font-weight: 600; color: var(--text);">Compare Original vs Modified Text</div>
            <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-outline" id="diffSampleBtn" style="padding: 0.3rem 0.7rem; font-size: 0.8rem;">Load Sample</button>
                <button class="btn btn-outline" id="diffSwapBtn" style="padding: 0.3rem 0.7rem; font-size: 0.8rem;">⇄ Swap</button>
                <button class="btn btn-outline" id="diffClearBtn" style="padding: 0.3rem 0.7rem; font-size: 0.8rem;">Clear</button>
            </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; margin-bottom: 1.25rem;" class="diff-input-grid">
            <div class="input-group" style="margin-bottom: 0;">
                <label for="diffOriginal" class="input-label">Original Text</label>
                <textarea id="diffOriginal" class="textarea-field" style="height: 160px; font-family: var(--font-mono); font-size: 0.82rem;" placeholder="Paste original version here..."></textarea>
            </div>
            <div class="input-group" style="margin-bottom: 0;">
                <label for="diffModified" class="input-label">Modified Text</label>
                <textarea id="diffModified" class="textarea-field" style="height: 160px; font-family: var(--font-mono); font-size: 0.82rem;" placeholder="Paste modified version here..."></textarea>
            </div>
        </div>

        <!-- Diff Output Visualizer -->
        <div>
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.5rem;">
                <label class="input-label" style="margin-bottom: 0;">Visual Diff Output</label>
                <div id="diffSummaryBadge" style="font-size: 0.8rem; font-family: var(--font-mono); color: var(--text-muted);">0 differences</div>
            </div>
            <div id="diffOutputContainer" style="background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 0.75rem; min-height: 140px; max-height: 380px; overflow-y: auto; font-family: var(--font-mono); font-size: 0.82rem; line-height: 1.6;"></div>
        </div>
    </div>

    <!-- Section 2: Case Converter -->
    <div id="section-case" class="tool-section" style="display: none;">
        <div class="input-group">
            <label for="caseInputText" class="input-label">Input Text to Transform</label>
            <textarea id="caseInputText" class="textarea-field" style="height: 120px;" placeholder="Type or paste any text or variable name here...">atelier digital powerhouse suite for creators</textarea>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 0.6rem; margin-bottom: 1.5rem;">
            <button class="btn btn-outline case-btn" data-case="camel">camelCase</button>
            <button class="btn btn-outline case-btn" data-case="pascal">PascalCase</button>
            <button class="btn btn-outline case-btn" data-case="snake">snake_case</button>
            <button class="btn btn-outline case-btn" data-case="kebab">kebab-case</button>
            <button class="btn btn-outline case-btn" data-case="constant">CONSTANT_CASE</button>
            <button class="btn btn-outline case-btn" data-case="title">Title Case</button>
            <button class="btn btn-outline case-btn" data-case="sentence">Sentence case</button>
            <button class="btn btn-outline case-btn" data-case="upper">UPPERCASE</button>
            <button class="btn btn-outline case-btn" data-case="lower">lowercase</button>
            <button class="btn btn-outline case-btn" data-case="slug">slugify-url</button>
        </div>

        <div class="input-group" style="margin-bottom: 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                <label for="caseOutputText" class="input-label" style="margin-bottom: 0;">Transformed Output</label>
                <button class="btn btn-primary" id="copyCaseBtn" style="padding: 0.25rem 0.75rem; font-size: 0.8rem;">📋 Copy Result</button>
            </div>
            <textarea id="caseOutputText" class="textarea-field" style="height: 120px; font-family: var(--font-mono); font-size: 0.88rem;" readonly></textarea>
        </div>
    </div>

    <!-- Section 3: String Analytics -->
    <div id="section-stats" class="tool-section" style="display: none;">
        <div class="input-group">
            <label for="statsInputText" class="input-label">Enter Text for Metric Analysis</label>
            <textarea id="statsInputText" class="textarea-field" style="height: 140px;" placeholder="Paste article, blog post, or code documentation here..."></textarea>
        </div>

        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem;">
            <div style="background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 1rem; text-align: center;">
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent);" id="statWords">0</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">Total Words</div>
            </div>
            <div style="background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 1rem; text-align: center;">
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent);" id="statChars">0</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">Characters (with spaces)</div>
            </div>
            <div style="background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 1rem; text-align: center;">
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent);" id="statCharsNoSpace">0</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">Characters (no spaces)</div>
            </div>
            <div style="background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 1rem; text-align: center;">
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent);" id="statLines">0</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">Total Lines</div>
            </div>
            <div style="background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 1rem; text-align: center;">
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent);" id="statReadTime">0 min</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">Estimated Reading Time</div>
            </div>
            <div style="background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 1rem; text-align: center;">
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--accent);" id="statSpeakTime">0 min</div>
                <div style="font-size: 0.8rem; color: var(--text-muted);">Estimated Speaking Time</div>
            </div>
        </div>
    </div>
`;

export function init() {
    // Tab switching
    const tabDiff = document.getElementById('tab-diff');
    const tabCase = document.getElementById('tab-case');
    const tabStats = document.getElementById('tab-stats');
    const tabs = [tabDiff, tabCase, tabStats];

    const sectionDiff = document.getElementById('section-diff');
    const sectionCase = document.getElementById('section-case');
    const sectionStats = document.getElementById('section-stats');
    const sections = [sectionDiff, sectionCase, sectionStats];

    function setTab(tab, sec) {
        tabs.forEach(t => t.classList.remove('active'));
        sections.forEach(s => s.style.display = 'none');
        tab.classList.add('active');
        sec.style.display = 'block';
    }

    tabDiff.addEventListener('click', () => setTab(tabDiff, sectionDiff));
    tabCase.addEventListener('click', () => setTab(tabCase, sectionCase));
    tabStats.addEventListener('click', () => setTab(tabStats, sectionStats));

    // --- 1. Diff Logic ---
    const diffOriginal = document.getElementById('diffOriginal');
    const diffModified = document.getElementById('diffModified');
    const diffOutputContainer = document.getElementById('diffOutputContainer');
    const diffSummaryBadge = document.getElementById('diffSummaryBadge');
    const diffSampleBtn = document.getElementById('diffSampleBtn');
    const diffSwapBtn = document.getElementById('diffSwapBtn');
    const diffClearBtn = document.getElementById('diffClearBtn');

    function escapeHtml(str) {
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }

    function computeDiff() {
        const orig = diffOriginal.value;
        const mod = diffModified.value;

        if (!orig && !mod) {
            diffOutputContainer.innerHTML = '<div style="color: var(--text-muted); text-align: center; padding: 2rem;">Enter text above to compute visual diff.</div>';
            diffSummaryBadge.innerText = '0 differences';
            return;
        }

        const origLines = orig.split('\n');
        const modLines = mod.split('\n');

        let additions = 0;
        let deletions = 0;
        let diffHtml = '';

        const max = Math.max(origLines.length, modLines.length);

        for (let i = 0; i < max; i++) {
            const o = origLines[i];
            const m = modLines[i];

            if (o === undefined) {
                // Pure addition
                additions++;
                diffHtml += `<div style="background: rgba(0, 229, 153, 0.15); color: var(--accent); padding: 2px 6px; border-left: 3px solid var(--accent);"><span style="color: var(--text-muted); display: inline-block; width: 35px; user-select: none;">+${i+1}</span>+ ${escapeHtml(m)}</div>`;
            } else if (m === undefined) {
                // Pure deletion
                deletions++;
                diffHtml += `<div style="background: rgba(239, 68, 68, 0.15); color: #ef4444; padding: 2px 6px; border-left: 3px solid #ef4444;"><span style="color: var(--text-muted); display: inline-block; width: 35px; user-select: none;">-${i+1}</span>- ${escapeHtml(o)}</div>`;
            } else if (o === m) {
                // Unchanged
                diffHtml += `<div style="padding: 2px 6px; color: var(--text-muted);"><span style="display: inline-block; width: 35px; user-select: none;"> ${i+1}</span>  ${escapeHtml(o)}</div>`;
            } else {
                // Modified line
                deletions++;
                additions++;
                diffHtml += `<div style="background: rgba(239, 68, 68, 0.12); color: #ef4444; padding: 2px 6px; border-left: 3px solid #ef4444;"><span style="color: var(--text-muted); display: inline-block; width: 35px; user-select: none;">-${i+1}</span>- ${escapeHtml(o)}</div>`;
                diffHtml += `<div style="background: rgba(0, 229, 153, 0.12); color: var(--accent); padding: 2px 6px; border-left: 3px solid var(--accent);"><span style="color: var(--text-muted); display: inline-block; width: 35px; user-select: none;">+${i+1}</span>+ ${escapeHtml(m)}</div>`;
            }
        }

        diffOutputContainer.innerHTML = diffHtml;
        diffSummaryBadge.innerHTML = `<span style="color: var(--accent);">+${additions}</span> / <span style="color: #ef4444;">-${deletions}</span>`;
    }

    [diffOriginal, diffModified].forEach(el => el.addEventListener('input', computeDiff));

    diffSampleBtn.addEventListener('click', () => {
        diffOriginal.value = `// User Session Config\nconst config = {\n  timeout: 3000,\n  enableLogging: true,\n  theme: "dark",\n  retryCount: 3\n};`;
        diffModified.value = `// User Session Config (Production)\nconst config = {\n  timeout: 5000,\n  enableLogging: false,\n  theme: "system",\n  retryCount: 5,\n  cacheEnabled: true\n};`;
        computeDiff();
    });

    diffSwapBtn.addEventListener('click', () => {
        const temp = diffOriginal.value;
        diffOriginal.value = diffModified.value;
        diffModified.value = temp;
        computeDiff();
    });

    diffClearBtn.addEventListener('click', () => {
        diffOriginal.value = '';
        diffModified.value = '';
        computeDiff();
    });

    // --- 2. Case Conversion Logic ---
    const caseInputText = document.getElementById('caseInputText');
    const caseOutputText = document.getElementById('caseOutputText');
    const copyCaseBtn = document.getElementById('copyCaseBtn');

    function wordsFromText(str) {
        return str
            .replace(/([a-z])([A-Z])/g, '$1 $2')
            .replace(/[_\-.]+/g, ' ')
            .trim()
            .split(/\s+/);
    }

    function transformCase(type) {
        const input = caseInputText.value;
        if (!input) {
            caseOutputText.value = '';
            return;
        }

        const words = wordsFromText(input);
        let result = '';

        switch(type) {
            case 'camel':
                result = words.map((w, i) => i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
                break;
            case 'pascal':
                result = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
                break;
            case 'snake':
                result = words.map(w => w.toLowerCase()).join('_');
                break;
            case 'kebab':
                result = words.map(w => w.toLowerCase()).join('-');
                break;
            case 'constant':
                result = words.map(w => w.toUpperCase()).join('_');
                break;
            case 'title':
                result = words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
                break;
            case 'sentence':
                result = input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, c => c.toUpperCase());
                break;
            case 'upper':
                result = input.toUpperCase();
                break;
            case 'lower':
                result = input.toLowerCase();
                break;
            case 'slug':
                result = words.map(w => w.toLowerCase().replace(/[^a-z0-9]/g, '')).filter(Boolean).join('-');
                break;
        }

        caseOutputText.value = result;
    }

    document.querySelectorAll('.case-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const c = e.currentTarget.getAttribute('data-case');
            transformCase(c);
        });
    });

    copyCaseBtn.addEventListener('click', () => {
        if (!caseOutputText.value) return;
        navigator.clipboard.writeText(caseOutputText.value).then(() => {
            window.Atelier.showToast('Copied transformed text!', 'success');
        });
    });

    // --- 3. Text Stats Logic ---
    const statsInputText = document.getElementById('statsInputText');
    const statWords = document.getElementById('statWords');
    const statChars = document.getElementById('statChars');
    const statCharsNoSpace = document.getElementById('statCharsNoSpace');
    const statLines = document.getElementById('statLines');
    const statReadTime = document.getElementById('statReadTime');
    const statSpeakTime = document.getElementById('statSpeakTime');

    function updateStats() {
        const text = statsInputText.value;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        const chars = text.length;
        const charsNoSpace = text.replace(/\s+/g, '').length;
        const lines = text ? text.split(/\r\n|\r|\n/).length : 0;

        const readMinutes = Math.ceil(words / 200);
        const speakMinutes = Math.ceil(words / 130);

        statWords.innerText = words.toLocaleString();
        statChars.innerText = chars.toLocaleString();
        statCharsNoSpace.innerText = charsNoSpace.toLocaleString();
        statLines.innerText = lines.toLocaleString();
        statReadTime.innerText = words > 0 ? `${readMinutes} min` : '0 min';
        statSpeakTime.innerText = words > 0 ? `${speakMinutes} min` : '0 min';
    }

    statsInputText.addEventListener('input', updateStats);

    // Initial setup
    transformCase('camel');
    computeDiff();
}
