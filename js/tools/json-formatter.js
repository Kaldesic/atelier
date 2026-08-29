export const html = `
<div class="tool-header">
    <h2>JSON Formatter & Validator</h2>
    <p>Validate, format, minify, and beautify your JSON data instantly.</p>
</div>
<div class="tool-content" style="display: flex; flex-direction: column; gap: 1rem;">
    <div class="json-controls" style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
        <button id="btn-format-2" class="btn" style="background: var(--accent);">2 Spaces</button>
        <button id="btn-format-4" class="btn" style="background: var(--card-bg);">4 Spaces</button>
        <button id="btn-minify" class="btn" style="background: var(--card-bg);">Minify</button>
        <button id="btn-clear" class="btn" style="background: var(--card-bg);">Clear</button>
        <button id="btn-copy" class="btn" style="margin-left: auto;">Copy Output</button>
    </div>
    
    <div id="json-status" style="padding: 0.75rem; border-radius: 6px; display: none; font-family: var(--font-mono, monospace); font-size: 0.9rem;"></div>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1rem; align-items: stretch;">
        <div class="input-pane" style="display: flex; flex-direction: column;">
            <label class="input-label">Input</label>
            <textarea id="json-input" placeholder="Paste your raw JSON here..." style="width: 100%; height: 500px; padding: 1rem; background: var(--card-bg); border: 1px solid var(--border); color: var(--text); border-radius: 8px; font-family: var(--font-mono, monospace); font-size: 0.9rem; resize: vertical; outline: none;"></textarea>
        </div>
        <div class="output-pane" style="display: flex; flex-direction: column;">
            <label class="input-label">Output</label>
            <pre id="json-output" style="width: 100%; height: 500px; margin: 0; padding: 1rem; background: var(--bg); border: 1px solid var(--border); color: var(--text); border-radius: 8px; font-family: var(--font-mono, monospace); font-size: 0.9rem; overflow: auto; white-space: pre-wrap; word-break: break-all; outline: none;"></pre>
        </div>
    </div>
</div>

<style>
    .json-string { color: #38bdf8; }
    .json-number { color: #60a5fa; }
    .json-boolean { color: #f87171; }
    .json-null { color: #f87171; }
    .json-key { color: #34d399; font-weight: 500; }
    
    #json-input:focus, #json-output:focus-visible {
        border-color: var(--accent);
    }
</style>
`;

export function init() {
    const input = document.getElementById('json-input');
    const output = document.getElementById('json-output');
    const status = document.getElementById('json-status');
    const btnFormat2 = document.getElementById('btn-format-2');
    const btnFormat4 = document.getElementById('btn-format-4');
    const btnMinify = document.getElementById('btn-minify');
    const btnClear = document.getElementById('btn-clear');
    const btnCopy = document.getElementById('btn-copy');
    const formatBtns = [btnFormat2, btnFormat4, btnMinify];
    
    let currentIndent = 2;
    let currentParsed = null;

    function setActiveBtn(btn) {
        formatBtns.forEach(b => b.style.background = 'var(--card-bg)');
        btn.style.background = 'var(--accent)';
    }

    function escapeHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    function syntaxHighlight(jsonStr) {
        const escaped = escapeHtml(jsonStr);
        return escaped.replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
            let cls = 'json-number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'json-key';
                } else {
                    cls = 'json-string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'json-boolean';
            } else if (/null/.test(match)) {
                cls = 'json-null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        });
    }

    function processJSON() {
        const raw = input.value.trim();
        if (!raw) {
            output.textContent = '';
            status.style.display = 'none';
            currentParsed = null;
            return;
        }

        try {
            currentParsed = JSON.parse(raw);
            
            status.style.display = 'block';
            status.style.background = 'rgba(52, 211, 153, 0.1)';
            status.style.color = '#34d399';
            status.style.border = '1px solid rgba(52, 211, 153, 0.3)';
            status.textContent = 'Valid JSON';

            const formatted = JSON.stringify(currentParsed, null, currentIndent);
            output.innerHTML = syntaxHighlight(formatted);
            
        } catch (e) {
            currentParsed = null;
            
            status.style.display = 'block';
            status.style.background = 'rgba(248, 113, 113, 0.1)';
            status.style.color = '#f87171';
            status.style.border = '1px solid rgba(248, 113, 113, 0.3)';
            status.textContent = `Invalid JSON: ${e.message}`;
            
            output.textContent = input.value;
        }
    }

    input.addEventListener('input', processJSON);

    btnFormat2.addEventListener('click', () => { 
        currentIndent = 2; 
        setActiveBtn(btnFormat2);
        processJSON(); 
    });
    
    btnFormat4.addEventListener('click', () => { 
        currentIndent = 4; 
        setActiveBtn(btnFormat4);
        processJSON(); 
    });
    
    btnMinify.addEventListener('click', () => { 
        currentIndent = 0; 
        setActiveBtn(btnMinify);
        processJSON(); 
    });
    
    btnClear.addEventListener('click', () => {
        input.value = '';
        processJSON();
        input.focus();
    });

    btnCopy.addEventListener('click', () => {
        if (currentParsed !== null) {
            const textToCopy = JSON.stringify(currentParsed, null, currentIndent);
            navigator.clipboard.writeText(textToCopy).then(() => {
                window.Atelier?.showToast('JSON copied to clipboard!');
            }).catch(() => {
                window.Atelier?.showToast('Failed to copy', 'error');
            });
        } else if (input.value) {
            navigator.clipboard.writeText(input.value).then(() => {
                window.Atelier?.showToast('Raw text copied to clipboard!');
            });
        } else {
            window.Atelier?.showToast('Nothing to copy', 'error');
        }
    });
    
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = this.selectionStart;
            const end = this.selectionEnd;
            this.value = this.value.substring(0, start) + '  ' + this.value.substring(end);
            this.selectionStart = this.selectionEnd = start + 2;
            processJSON();
        }
    });
    
    window.Atelier?.setPasteHandler((e) => {
        if (document.activeElement !== input) {
            const paste = (e.clipboardData || window.clipboardData).getData('text');
            if (paste) {
                input.value = paste;
                processJSON();
            }
        }
    });
}
