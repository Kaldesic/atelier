export const html = `
    <h1>Markdown Live Preview & Converter</h1>
    <p class="subtitle">Write GitHub-flavored Markdown with live formatted preview, document statistics, and HTML / Markdown export.</p>

    <div class="tool-section">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 0.5rem;">
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;" class="md-toolbar">
                <button class="btn btn-outline md-tool-btn" data-action="bold" title="Bold (Ctrl+B)"><b>B</b></button>
                <button class="btn btn-outline md-tool-btn" data-action="italic" title="Italic (Ctrl+I)"><i>I</i></button>
                <button class="btn btn-outline md-tool-btn" data-action="h1" title="Heading 1">H1</button>
                <button class="btn btn-outline md-tool-btn" data-action="h2" title="Heading 2">H2</button>
                <button class="btn btn-outline md-tool-btn" data-action="link" title="Insert Link">🔗</button>
                <button class="btn btn-outline md-tool-btn" data-action="code" title="Inline Code">&lt;/&gt;</button>
                <button class="btn btn-outline md-tool-btn" data-action="quote" title="Blockquote">”</button>
                <button class="btn btn-outline md-tool-btn" data-action="ul" title="Bullet List">• List</button>
                <button class="btn btn-outline md-tool-btn" data-action="table" title="Table">▦ Table</button>
            </div>

            <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-outline" id="sampleMdBtn" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;">Load Sample</button>
                <button class="btn btn-outline" id="clearMdBtn" style="padding: 0.35rem 0.75rem; font-size: 0.8rem;">Clear</button>
            </div>
        </div>

        <!-- Editor & Preview Split View -->
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem;" class="markdown-split-view">
            <!-- Left: Markdown Input -->
            <div class="input-group" style="margin-bottom: 0;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                    <label for="mdInput" class="input-label" style="margin-bottom: 0;">Markdown Source</label>
                    <span id="mdStats" class="result-meta">0 words • 0 chars</span>
                </div>
                <textarea id="mdInput" class="textarea-field" style="height: 380px; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.5;" placeholder="# Write your markdown here..."></textarea>
            </div>

            <!-- Right: Live Rendered Output -->
            <div class="input-group" style="margin-bottom: 0;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.4rem;">
                    <label class="input-label" style="margin-bottom: 0;">Live Preview</label>
                    <span class="result-meta">Rendered HTML</span>
                </div>
                <div id="mdPreview" class="markdown-render-box" style="height: 380px; overflow-y: auto; background: var(--bg); border: 1px solid var(--border); border-radius: 8px; padding: 1.25rem; font-size: 0.9rem; line-height: 1.6; color: var(--text);"></div>
            </div>
        </div>

        <!-- Export Actions Bar -->
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 1.5rem; flex-wrap: wrap; gap: 0.75rem; border-top: 1px solid var(--border); padding-top: 1rem;">
            <div style="display: flex; gap: 0.5rem;">
                <button class="btn btn-primary" id="copyHtmlBtn" style="padding: 0.45rem 0.9rem; font-size: 0.85rem;">Copy Clean HTML</button>
                <button class="btn btn-outline" id="copyRawMdBtn" style="padding: 0.45rem 0.9rem; font-size: 0.85rem;">Copy Markdown</button>
            </div>
            <button class="btn btn-outline" id="downloadMdBtn" style="padding: 0.45rem 0.9rem; font-size: 0.85rem;">Download .md</button>
        </div>
    </div>
`;

export function init() {
    const mdInput = document.getElementById('mdInput');
    const mdPreview = document.getElementById('mdPreview');
    const mdStats = document.getElementById('mdStats');
    const sampleMdBtn = document.getElementById('sampleMdBtn');
    const clearMdBtn = document.getElementById('clearMdBtn');
    const copyHtmlBtn = document.getElementById('copyHtmlBtn');
    const copyRawMdBtn = document.getElementById('copyRawMdBtn');
    const downloadMdBtn = document.getElementById('downloadMdBtn');

    function sanitizeUrl(url) {
        const trimmed = url.trim();
        if (/^(javascript|data|vbscript):/i.test(trimmed)) {
            return '#';
        }
        return trimmed;
    }

    function parseMarkdown(md) {
        if (!md) return '';

        let out = md
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');

        // Multi-line Code blocks
        out = out.replace(/```([a-z]*)\n([\s\S]*?)```/g, (match, lang, code) => {
            return `<pre style="background: var(--card-bg); border: 1px solid var(--border); padding: 1rem; border-radius: 8px; overflow-x: auto; margin: 1rem 0;"><code style="font-family: var(--font-mono); font-size: 0.85rem; color: var(--accent);">${code.trim()}</code></pre>`;
        });

        // GFM Tables parsing
        out = out.replace(/^\|(.+)\|\r?\n\|( *[-:]+[-| :]*)\|/gm, (match, headerRow) => {
            const headers = headerRow.split('|').map(h => h.trim()).filter(h => h.length > 0);
            const headerHtml = headers.map(h => `<th style="border: 1px solid var(--border); padding: 0.5rem 0.75rem; background: var(--card-bg);">${h}</th>`).join('');
            return `<table style="width: 100%; border-collapse: collapse; margin: 1rem 0;"><thead><tr>${headerHtml}</tr></thead><tbody>`;
        });
        out = out.replace(/^\|(.+)\|$/gm, (match, content) => {
            if (content.includes('---')) return ''; // Skip delimiter row
            const cols = content.split('|').map(c => c.trim()).filter(c => c.length > 0);
            const colsHtml = cols.map(c => `<td style="border: 1px solid var(--border); padding: 0.5rem 0.75rem;">${c}</td>`).join('');
            return `<tr>${colsHtml}</tr>`;
        });
        out = out.replace(/<\/tr><tbody>/g, '</tr>'); // Fix boundary transitions
        out = out.replace(/(<\/tr>)(?!\s*<tr>|\s*<\/tbody>)/g, '$1</tbody></table>');

        // Headers
        out = out.replace(/^### (.*$)/gim, '<h3 style="font-size: 1.15rem; font-weight: 700; margin: 1.2rem 0 0.5rem 0; color: var(--text);">$1</h3>');
        out = out.replace(/^## (.*$)/gim, '<h2 style="font-size: 1.35rem; font-weight: 700; margin: 1.4rem 0 0.5rem 0; border-bottom: 1px solid var(--border); padding-bottom: 0.3rem; color: var(--text);">$1</h2>');
        out = out.replace(/^# (.*$)/gim, '<h1 style="font-size: 1.65rem; font-weight: 800; margin: 1rem 0 0.6rem 0; border-bottom: 1px solid var(--border); padding-bottom: 0.4rem; color: var(--text);">$1</h1>');

        // Blockquotes
        out = out.replace(/^\> (.*$)/gim, '<blockquote style="border-left: 3px solid var(--accent); margin: 0.8rem 0; padding-left: 0.8rem; color: var(--text-muted); font-style: italic;">$1</blockquote>');

        // Inline Styles: Bold, Italic, Strikethrough
        out = out.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>');
        out = out.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        out = out.replace(/\*(.*?)\*/g, '<em>$1</em>');
        out = out.replace(/~~(.*?)~~/g, '<del>$1</del>');

        // Inline Code
        out = out.replace(/`([^`]+)`/g, '<code style="background: var(--card-bg); border: 1px solid var(--border); padding: 0.15rem 0.4rem; border-radius: 4px; font-family: var(--font-mono); font-size: 0.85rem; color: var(--accent);">$1</code>');

        // Links & Images (Safer URI Handling)
        out = out.replace(/!\[(.*?)\]\((.*?)\)/g, (m, alt, src) => `<img alt="${alt}" src="${sanitizeUrl(src)}" style="max-width: 100%; border-radius: 8px; margin: 0.5rem 0;" />`);
        out = out.replace(/\[(.*?)\]\((.*?)\)/g, (m, text, href) => `<a href="${sanitizeUrl(href)}" target="_blank" rel="noopener noreferrer" style="color: var(--accent); text-decoration: underline;">${text}</a>`);

        // Horizontal rules
        out = out.replace(/^---$/gim, '<hr style="border: 0; border-top: 1px solid var(--border); margin: 1.2rem 0;" />');

        // Unordered List Items
        out = out.replace(/^\s*[\-\*]\s+(.*$)/gim, '<li style="margin-left: 1.25rem; list-style-type: disc;">$1</li>');

        // Line Breaks handling without breaking HTML blocks
        out = out.split('\n\n').map(p => {
            if (p.trim().startsWith('<pre') || p.trim().startsWith('<table') || p.trim().startsWith('<h') || p.trim().startsWith('<blockquote')) {
                return p;
            }
            return `<p style="margin-bottom: 0.85rem;">${p.replace(/\n/g, '<br/>')}</p>`;
        }).join('');

        return out;
    }

    function update() {
        const val = mdInput.value;
        const words = val.trim() ? val.trim().split(/\s+/).length : 0;
        const chars = val.length;
        mdStats.innerText = `${words} word${words === 1 ? '' : 's'} • ${chars} char${chars === 1 ? '' : 's'}`;

        if (!val) {
            mdPreview.innerHTML = '<p style="color: var(--text-muted); font-style: italic;">Preview will appear here in real-time...</p>';
            return;
        }

        mdPreview.innerHTML = parseMarkdown(val);
    }

    mdInput.addEventListener('input', update);

    function applyWrap(before, after = before, defaultText = 'text') {
        const start = mdInput.selectionStart;
        const end = mdInput.selectionEnd;
        const text = mdInput.value;
        const selected = text.substring(start, end) || defaultText;
        const replacement = before + selected + after;
        mdInput.value = text.substring(0, start) + replacement + text.substring(end);
        mdInput.focus();
        mdInput.setSelectionRange(start + before.length, start + before.length + selected.length);
        update();
    }

    document.querySelectorAll('.md-tool-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = e.currentTarget.getAttribute('data-action');
            switch (action) {
                case 'bold': applyWrap('**', '**', 'bold text'); break;
                case 'italic': applyWrap('*', '*', 'italic text'); break;
                case 'h1': applyWrap('# ', '', 'Heading 1'); break;
                case 'h2': applyWrap('## ', '', 'Heading 2'); break;
                case 'link': applyWrap('[', '](https://example.com)', 'link text'); break;
                case 'code': applyWrap('`', '`', 'code'); break;
                case 'quote': applyWrap('> ', '', 'Quoted thought'); break;
                case 'ul': applyWrap('- ', '', 'List item'); break;
                case 'table':
                    const tableTpl = `\n| Column 1 | Column 2 |\n|---|---|\n| Item A | Value 1 |\n| Item B | Value 2 |\n`;
                    applyWrap('', '', tableTpl);
                    break;
            }
        });
    });

    sampleMdBtn.addEventListener('click', () => {
        mdInput.value = `# 🚀 Atelier Markdown Document

Atelier is a minimalist, **zero-telemetry** digital workshop designed for web creators.

## Key Features
- **100% Client-side**: Processing strictly in memory
- *Ultra fast*: Real-time updates with zero backend latency

| Feature | Support |
|---|---|
| Privacy | 100% Client-side |
| Performance | Instant |

> "Simplicity is the prerequisite for reliability." — Edsger W. Dijkstra

### Sample Code
\`\`\`javascript
const atelier = {
  private: true,
  offlineFirst: true
};
console.log('Crafted with precision.');
\`\`\``;
        update();
        window.Atelier?.showToast?.('Sample markdown loaded!', 'info');
    });

    clearMdBtn.addEventListener('click', () => {
        mdInput.value = '';
        update();
        mdInput.focus();
    });

    copyHtmlBtn.addEventListener('click', () => {
        const htmlContent = mdPreview.innerHTML;
        if (!htmlContent) return;
        navigator.clipboard.writeText(htmlContent).then(() => {
            window.Atelier?.showToast?.('Copied HTML output!', 'success');
        });
    });

    copyRawMdBtn.addEventListener('click', () => {
        if (!mdInput.value) return;
        navigator.clipboard.writeText(mdInput.value).then(() => {
            window.Atelier?.showToast?.('Copied Markdown source!', 'success');
        });
    });

    downloadMdBtn.addEventListener('click', () => {
        if (!mdInput.value) return;
        const blob = new Blob([mdInput.value], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'document.md';
        a.click();
        URL.revokeObjectURL(url);
        window.Atelier?.showToast?.('Downloaded document.md', 'success');
    });

    mdInput.addEventListener('keydown', (e) => {
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
            e.preventDefault();
            applyWrap('**', '**', 'bold text');
        } else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'i') {
            e.preventDefault();
            applyWrap('*', '*', 'italic text');
        }
    });

    update();
}
