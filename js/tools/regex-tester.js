export const html = `
    <h1>Regex Tester & Pattern Analyzer</h1>
    <p class="subtitle">Test JavaScript Regular Expressions with live match highlights, capture group extraction, and substitution.</p>

    <div class="tool-section">
        <!-- Regex Input with Flags -->
        <div class="input-group">
            <label for="regexPattern" class="input-label">Regular Expression Pattern</label>
            <div style="display: flex; gap: 0.5rem; align-items: center;">
                <div style="font-family: var(--font-mono); font-size: 1.2rem; color: var(--accent); font-weight: 700;">/</div>
                <input type="text" id="regexPattern" class="input-field" value="([a-zA-Z0-9._-]+)@([a-zA-Z0-9._-]+)\\.([a-zA-Z]{2,})" style="font-family: var(--font-mono); font-weight: 500;" placeholder="Enter pattern here...">
                <div style="font-family: var(--font-mono); font-size: 1.2rem; color: var(--accent); font-weight: 700;">/</div>
                <input type="text" id="regexFlags" class="input-field" value="g" style="width: 70px; font-family: var(--font-mono); text-align: center;" placeholder="flags" title="Flags: g (global), i (ignore case), m (multiline), s (dotAll)">
            </div>
        </div>

        <!-- Flag Pills -->
        <div style="display: flex; gap: 0.5rem; margin-bottom: 1.25rem; flex-wrap: wrap;" class="presets-bar">
            <button class="preset-btn active" data-flag="g">Global (g)</button>
            <button class="preset-btn" data-flag="i">Case Insensitive (i)</button>
            <button class="preset-btn" data-flag="m">Multiline (m)</button>
            <button class="preset-btn" data-flag="s">Dot All (s)</button>
        </div>

        <!-- Test Text Input -->
        <div class="input-group">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                <label for="testString" class="input-label" style="margin-bottom: 0;">Test String</label>
                <span id="matchStats" class="result-meta">0 matches</span>
            </div>
            <textarea id="testString" class="textarea-field" style="height: 120px; font-family: var(--font-mono); font-size: 0.85rem;" placeholder="Paste sample text to test matches against...">Contact our support team at support@atelier.dev or reach out to sales.lead@domain.co.uk for inquiries. You can also contact john_doe-12@tech-lab.io!</textarea>
        </div>

        <!-- Highlighted Matches View -->
        <div class="input-group">
            <label class="input-label">Highlighted Matches</label>
            <div id="highlightedOutput" style="min-height: 90px; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 0.85rem; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.6; word-break: break-all; white-space: pre-wrap;"></div>
        </div>

        <!-- Match Details Table -->
        <div id="matchesContainer" style="margin-top: 1.5rem;">
            <label class="input-label">Extracted Capture Groups & Indices</label>
            <div id="matchesTableWrapper" style="overflow-x: auto;">
                <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
                    <thead>
                        <tr style="border-bottom: 1px solid var(--border); color: var(--text-muted);">
                            <th style="padding: 0.5rem; width: 60px;">#</th>
                            <th style="padding: 0.5rem;">Full Match</th>
                            <th style="padding: 0.5rem;">Capture Groups</th>
                            <th style="padding: 0.5rem; width: 100px;">Index</th>
                        </tr>
                    </thead>
                    <tbody id="matchesBody"></tbody>
                </table>
            </div>
        </div>
    </div>

    <!-- Replacement & Substitution Section -->
    <div class="tool-section">
        <h2 class="tool-section-title" style="margin-bottom: 1rem;">Substitution & Replace</h2>
        <div class="input-group">
            <label for="replacePattern" class="input-label">Replace Expression</label>
            <input type="text" id="replacePattern" class="input-field" value="[EMAIL: $1@***.$3]" style="font-family: var(--font-mono);" placeholder="e.g. $1 or custom string">
        </div>
        <div class="input-group" style="margin-bottom: 0;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                <label for="replacedOutput" class="input-label" style="margin-bottom: 0;">Replaced Output</label>
                <button class="btn btn-outline" id="copyReplacedBtn" style="padding: 0.2rem 0.6rem; font-size: 0.75rem;">Copy Output</button>
            </div>
            <textarea id="replacedOutput" class="textarea-field" style="height: 90px; font-family: var(--font-mono); font-size: 0.85rem;" readonly></textarea>
        </div>
    </div>
`;

export function init() {
    const regexPattern = document.getElementById('regexPattern');
    const regexFlags = document.getElementById('regexFlags');
    const testString = document.getElementById('testString');
    const matchStats = document.getElementById('matchStats');
    const highlightedOutput = document.getElementById('highlightedOutput');
    const matchesBody = document.getElementById('matchesBody');
    const matchesTableWrapper = document.getElementById('matchesTableWrapper');
    const replacePattern = document.getElementById('replacePattern');
    const replacedOutput = document.getElementById('replacedOutput');
    const copyReplacedBtn = document.getElementById('copyReplacedBtn');

    // Flag toggle buttons
    const flagButtons = document.querySelectorAll('[data-flag]');
    
    function syncFlagButtons() {
        const currentFlags = regexFlags.value;
        flagButtons.forEach(btn => {
            const f = btn.getAttribute('data-flag');
            if (currentFlags.includes(f)) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    flagButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const f = btn.getAttribute('data-flag');
            let flags = regexFlags.value;
            if (flags.includes(f)) {
                flags = flags.replace(f, '');
            } else {
                flags += f;
            }
            regexFlags.value = flags;
            syncFlagButtons();
            testRegex();
        });
    });

    function escapeHtml(str) {
        const d = document.createElement('div');
        d.textContent = str;
        return d.innerHTML;
    }

    function testRegex() {
        const pattern = regexPattern.value;
        const flags = regexFlags.value;
        const text = testString.value;

        if (!pattern) {
            matchStats.innerText = '0 matches';
            highlightedOutput.innerHTML = escapeHtml(text);
            matchesBody.innerHTML = '<tr><td colspan="4" style="padding: 0.5rem; color: var(--text-muted);">No pattern defined.</td></tr>';
            replacedOutput.value = text;
            return;
        }

        try {
            const regex = new RegExp(pattern, flags);
            const globalRegex = new RegExp(pattern, flags.includes('g') ? flags : flags + 'g');

            // Find all matches
            const matches = [];
            let match;
            let lastIndex = 0;
            let highlighted = '';

            while ((match = globalRegex.exec(text)) !== null) {
                matches.push(match);
                // Highlight part before match
                highlighted += escapeHtml(text.substring(lastIndex, match.index));
                // Highlight match
                highlighted += `<mark style="background: rgba(0, 229, 153, 0.25); color: var(--accent); border-radius: 3px; padding: 1px 3px; border: 1px solid var(--accent);">${escapeHtml(match[0])}</mark>`;
                lastIndex = match.index + match[0].length;
                if (match[0].length === 0) {
                    globalRegex.lastIndex++;
                }
            }
            highlighted += escapeHtml(text.substring(lastIndex));
            highlightedOutput.innerHTML = highlighted;

            matchStats.innerText = `${matches.length} match${matches.length === 1 ? '' : 'es'}`;

            // Render Matches Table
            if (matches.length === 0) {
                matchesBody.innerHTML = '<tr><td colspan="4" style="padding: 0.5rem; color: var(--text-muted);">No matches found for this regular expression.</td></tr>';
            } else {
                matchesBody.innerHTML = matches.map((m, idx) => {
                    const groups = m.slice(1);
                    const groupsDisplay = groups.length > 0
                        ? groups.map((g, i) => `<span style="display: inline-block; background: var(--card-bg); border: 1px solid var(--border); border-radius: 4px; padding: 2px 6px; margin: 2px; font-family: var(--font-mono);"><span style="color: var(--text-muted);">$${i+1}:</span> ${escapeHtml(g || 'undefined')}</span>`).join('')
                        : '<span style="color: var(--text-muted); font-style: italic;">None</span>';

                    return `
                        <tr style="border-bottom: 1px solid var(--border);">
                            <td style="padding: 0.5rem; font-family: var(--font-mono); color: var(--text-muted);">${idx + 1}</td>
                            <td style="padding: 0.5rem; font-family: var(--font-mono); color: var(--accent); font-weight: 500;">${escapeHtml(m[0])}</td>
                            <td style="padding: 0.5rem;">${groupsDisplay}</td>
                            <td style="padding: 0.5rem; font-family: var(--font-mono); color: var(--text-muted);">${m.index}..${m.index + m[0].length}</td>
                        </tr>
                    `;
                }).join('');
            }

            // Perform Replacement
            const repl = replacePattern.value;
            replacedOutput.value = text.replace(regex, repl);

        } catch (err) {
            matchStats.innerText = 'Regex Syntax Error';
            highlightedOutput.innerHTML = `<span style="color: var(--error);">Error: ${escapeHtml(err.message)}</span>`;
            matchesBody.innerHTML = `<tr><td colspan="4" style="padding: 0.5rem; color: var(--error);">Invalid regular expression: ${escapeHtml(err.message)}</td></tr>`;
            replacedOutput.value = 'Invalid regular expression.';
        }
    }

    [regexPattern, regexFlags, testString, replacePattern].forEach(el => {
        el.addEventListener('input', testRegex);
    });

    copyReplacedBtn.addEventListener('click', () => {
        if (!replacedOutput.value) return;
        navigator.clipboard.writeText(replacedOutput.value).then(() => {
            window.Atelier.showToast('Copied replaced text!', 'success');
        });
    });

    syncFlagButtons();
    testRegex();
}
