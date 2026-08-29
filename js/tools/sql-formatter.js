/* js/tools/sql-formatter.js - SQL Formatter, Beautifier & Syntax Validator */

export const html = `
<div class="tool-section" id="sql-formatter-tool">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem;">
        <div>
            <h1 class="tool-section-title" style="margin-bottom: 0.25rem;">SQL Formatter & Validator</h1>
            <p style="color: var(--text-muted); font-size: 0.85rem;">Beautify, indent, uppercase keywords, and validate SQL queries client-side.</p>
        </div>
    </div>

    <!-- Presets bar -->
    <div class="presets-bar" style="margin-bottom: 1rem;">
        <span style="font-size: 0.8rem; color: var(--text-muted); align-self: center; margin-right: 0.25rem;">Sample Queries:</span>
        <button class="preset-btn" id="sql-sample-select">Complex SELECT & JOIN</button>
        <button class="preset-btn" id="sql-sample-crud">CRUD Operations</button>
        <button class="preset-btn" id="sql-sample-schema">CREATE TABLE & Indexes</button>
        <button class="preset-btn" id="sql-sample-subquery">Subqueries & CTEs</button>
    </div>

    <!-- Formatting Options Grid -->
    <div class="controls-grid" style="grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 1rem; margin-bottom: 1.25rem; background: var(--bg); padding: 1rem; border-radius: 8px; border: 1px solid var(--border);">
        <div class="input-group" style="margin-bottom: 0;">
            <label class="input-label" for="sql-keyword-case">Keyword Case</label>
            <select id="sql-keyword-case" class="select-field">
                <option value="upper" selected>UPPERCASE</option>
                <option value="lower">lowercase</option>
                <option value="preserve">Preserve As-Is</option>
            </select>
        </div>
        <div class="input-group" style="margin-bottom: 0;">
            <label class="input-label" for="sql-indent-size">Indentation</label>
            <select id="sql-indent-size" class="select-field">
                <option value="2" selected>2 Spaces</option>
                <option value="4">4 Spaces</option>
                <option value="tab">Tab Character</option>
            </select>
        </div>
        <div class="input-group" style="margin-bottom: 0;">
            <label class="input-label" for="sql-dialect">Dialect Rules</label>
            <select id="sql-dialect" class="select-field">
                <option value="standard" selected>Standard ANSI / PostgreSQL</option>
                <option value="mysql">MySQL / MariaDB</option>
                <option value="sqlite">SQLite</option>
            </select>
        </div>
        <div class="input-group" style="margin-bottom: 0;">
            <label class="input-label" for="sql-comma-break">Clause Lines</label>
            <select id="sql-comma-break" class="select-field">
                <option value="break" selected>New line on clauses</option>
                <option value="compact">Compact clauses</option>
            </select>
        </div>
    </div>

    <!-- Main Workspace Split -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; margin-bottom: 1.25rem;" id="sql-split-container">
        <!-- Input Area -->
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <label for="sql-input" class="input-label" style="margin-bottom: 0; font-weight: 600;">Raw SQL Input</label>
                <button class="btn btn-outline" id="sql-clear-btn" style="padding: 0.25rem 0.6rem; font-size: 0.75rem;">Clear</button>
            </div>
            <textarea id="sql-input" class="textarea-field" spellcheck="false" placeholder="Paste or type your SQL queries here..." style="height: 360px; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.45; resize: vertical;"></textarea>
        </div>

        <!-- Formatted Output Area -->
        <div style="display: flex; flex-direction: column; gap: 0.5rem;">
            <div style="display: flex; justify-content: space-between; align-items: center;">
                <label for="sql-output" class="input-label" style="margin-bottom: 0; font-weight: 600;">Formatted & Validated SQL</label>
                <div style="display: flex; gap: 0.4rem;">
                    <button class="btn btn-outline" id="sql-minify-btn" style="padding: 0.25rem 0.6rem; font-size: 0.75rem;" title="Flatten SQL into a single line">Minify / One-line</button>
                    <button class="btn btn-primary" id="sql-copy-btn" style="padding: 0.25rem 0.75rem; font-size: 0.75rem;">Copy SQL</button>
                </div>
            </div>
            <textarea id="sql-output" class="textarea-field" readonly spellcheck="false" style="height: 360px; font-family: var(--font-mono); font-size: 0.85rem; line-height: 1.45; resize: vertical; background: var(--bg);"></textarea>
        </div>
    </div>

    <!-- Validation & Stats Banner -->
    <div id="sql-status-card" style="background: var(--card-bg); border: 1px solid var(--border); border-radius: 8px; padding: 0.75rem 1rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.75rem;">
        <div id="sql-validation-msg" style="display: flex; align-items: center; gap: 0.5rem; font-size: 0.85rem; color: var(--success);">
            <span>✓</span> <span>Valid SQL syntax structure</span>
        </div>
        <div style="display: flex; gap: 1rem; font-size: 0.8rem; color: var(--text-muted);">
            <span id="sql-stat-lines">Lines: 0</span>
            <span id="sql-stat-tokens">Keywords: 0</span>
            <span id="sql-stat-chars">Chars: 0</span>
            <button id="sql-download-btn" class="btn btn-outline" style="padding: 0.2rem 0.5rem; font-size: 0.75rem;">Download .sql</button>
        </div>
    </div>
</div>
`;

export function init() {
    const input = document.getElementById('sql-input');
    const output = document.getElementById('sql-output');
    const keywordCaseSelect = document.getElementById('sql-keyword-case');
    const indentSizeSelect = document.getElementById('sql-indent-size');
    const dialectSelect = document.getElementById('sql-dialect');
    const commaBreakSelect = document.getElementById('sql-comma-break');
    const clearBtn = document.getElementById('sql-clear-btn');
    const copyBtn = document.getElementById('sql-copy-btn');
    const minifyBtn = document.getElementById('sql-minify-btn');
    const downloadBtn = document.getElementById('sql-download-btn');
    const validationMsg = document.getElementById('sql-validation-msg');
    const statLines = document.getElementById('sql-stat-lines');
    const statTokens = document.getElementById('sql-stat-tokens');
    const statChars = document.getElementById('sql-stat-chars');

    const SQL_MAJOR_CLAUSES = [
        'WITH', 'SELECT', 'FROM', 'WHERE', 'GROUP BY', 'HAVING', 'ORDER BY',
        'LIMIT', 'OFFSET', 'UNION', 'UNION ALL', 'EXCEPT', 'INTERSECT',
        'LEFT JOIN', 'RIGHT JOIN', 'INNER JOIN', 'FULL OUTER JOIN', 'FULL JOIN',
        'CROSS JOIN', 'JOIN', 'ON', 'INSERT INTO', 'VALUES', 'UPDATE', 'SET',
        'DELETE FROM', 'DELETE', 'CREATE TABLE', 'ALTER TABLE', 'DROP TABLE',
        'CREATE INDEX', 'DROP INDEX', 'BEGIN', 'COMMIT', 'ROLLBACK'
    ];

    const SQL_ALL_KEYWORDS = [
        ...SQL_MAJOR_CLAUSES,
        'AS', 'AND', 'OR', 'NOT', 'IN', 'IS', 'NULL', 'LIKE', 'ILIKE', 'BETWEEN',
        'EXISTS', 'CASE', 'WHEN', 'THEN', 'ELSE', 'END', 'ASC', 'DESC', 'DISTINCT',
        'ALL', 'ANY', 'SOME', 'INTO', 'DEFAULT', 'PRIMARY KEY', 'FOREIGN KEY',
        'REFERENCES', 'CHECK', 'UNIQUE', 'CONSTRAINT', 'CASCADE', 'RETURNING',
        'TRUE', 'FALSE', 'INTERVAL', 'COALESCE', 'COUNT', 'SUM', 'AVG', 'MIN', 'MAX'
    ];

    // Samples
    const SAMPLES = {
        select: `SELECT u.id, u.username, u.email, p.title AS project_title, COUNT(t.id) AS total_tasks, SUM(CASE WHEN t.status = 'completed' THEN 1 ELSE 0 END) AS completed_tasks FROM users u LEFT JOIN projects p ON p.user_id = u.id AND p.is_archived = false LEFT JOIN tasks t ON t.project_id = p.id WHERE u.created_at >= '2026-01-01' AND u.status IN ('active', 'verified') GROUP BY u.id, u.username, u.email, p.title HAVING COUNT(t.id) > 0 ORDER BY completed_tasks DESC, u.created_at ASC LIMIT 50 OFFSET 0;`,
        crud: `INSERT INTO customer_orders (customer_id, order_number, total_amount, currency, status, created_at) VALUES (1042, 'ORD-2026-8891', 249.99, 'USD', 'pending', NOW()) RETURNING id, order_number;\n\nUPDATE customer_orders SET status = 'completed', updated_at = NOW() WHERE id = 1042 AND status = 'pending';\n\nDELETE FROM customer_cart_items WHERE customer_id = 1042;`,
        schema: `CREATE TABLE user_workspaces (\n  id BIGSERIAL PRIMARY KEY,\n  workspace_name VARCHAR(120) NOT NULL,\n  slug VARCHAR(80) UNIQUE NOT NULL,\n  owner_id BIGINT REFERENCES users(id) ON DELETE CASCADE,\n  settings JSONB DEFAULT '{}'::jsonb,\n  is_active BOOLEAN NOT NULL DEFAULT true,\n  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP\n);\n\nCREATE INDEX idx_workspaces_owner ON user_workspaces(owner_id);\nCREATE INDEX idx_workspaces_slug ON user_workspaces(slug);`,
        subquery: `WITH active_orgs AS (\n  SELECT org_id, COUNT(*) AS member_count FROM organization_members WHERE role != 'guest' GROUP BY org_id\n)\nSELECT a.org_id, o.name, a.member_count, (SELECT AVG(salary) FROM employee_records e WHERE e.org_id = a.org_id) AS average_salary FROM active_orgs a JOIN organizations o ON o.id = a.org_id WHERE a.member_count >= 5 ORDER BY a.member_count DESC;`
    };

    function validateSQL(sql) {
        if (!sql.trim()) {
            return { valid: true, message: 'Ready for input' };
        }

        // Bracket balance check
        let parenCount = 0;
        let singleQuotes = 0;
        let doubleQuotes = 0;
        let backticks = 0;

        for (let i = 0; i < sql.length; i++) {
            const char = sql[i];
            const prev = i > 0 ? sql[i - 1] : '';

            if (char === "'" && prev !== '\\') singleQuotes++;
            if (char === '"' && prev !== '\\') doubleQuotes++;
            if (char === '`' && prev !== '\\') backticks++;

            // Only count parentheses outside string literals
            if (singleQuotes % 2 === 0 && doubleQuotes % 2 === 0 && backticks % 2 === 0) {
                if (char === '(') parenCount++;
                if (char === ')') parenCount--;
                if (parenCount < 0) {
                    return { valid: false, message: `Unexpected closing parenthesis ')' at character ${i + 1}` };
                }
            }
        }

        if (singleQuotes % 2 !== 0) return { valid: false, message: 'Unclosed single quote detected' };
        if (doubleQuotes % 2 !== 0) return { valid: false, message: 'Unclosed double quote detected' };
        if (backticks % 2 !== 0) return { valid: false, message: 'Unclosed backtick detected' };
        if (parenCount > 0) return { valid: false, message: `Unclosed parenthesis: ${parenCount} unclosed '(' block(s)` };

        return { valid: true, message: 'Valid SQL syntax structure' };
    }

    function formatSQLString(raw) {
        if (!raw.trim()) return '';

        const keywordCase = keywordCaseSelect.value;
        const indentType = indentSizeSelect.value;
        const indentStr = indentType === 'tab' ? '\t' : ' '.repeat(parseInt(indentType, 10) || 2);
        const commaBreak = commaBreakSelect.value === 'break';

        // Tokenize SQL preserving quotes and comments
        const tokens = [];
        let i = 0;
        const len = raw.length;

        while (i < len) {
            // Whitespace
            if (/\s/.test(raw[i])) {
                i++;
                continue;
            }

            // String literals single quote
            if (raw[i] === "'") {
                let str = "'";
                i++;
                while (i < len && raw[i] !== "'") {
                    if (raw[i] === '\\' && i + 1 < len) {
                        str += raw[i] + raw[i + 1];
                        i += 2;
                    } else {
                        str += raw[i];
                        i++;
                    }
                }
                if (i < len) { str += raw[i]; i++; }
                tokens.push({ type: 'string', value: str });
                continue;
            }

            // String literals double quote or backticks
            if (raw[i] === '"' || raw[i] === '`') {
                const quoteChar = raw[i];
                let ident = quoteChar;
                i++;
                while (i < len && raw[i] !== quoteChar) {
                    ident += raw[i];
                    i++;
                }
                if (i < len) { ident += raw[i]; i++; }
                tokens.push({ type: 'identifier', value: ident });
                continue;
            }

            // Line comments
            if (raw[i] === '-' && raw[i + 1] === '-') {
                let comment = '';
                while (i < len && raw[i] !== '\n') {
                    comment += raw[i];
                    i++;
                }
                tokens.push({ type: 'comment', value: comment });
                continue;
            }

            // Block comments
            if (raw[i] === '/' && raw[i + 1] === '*') {
                let comment = '';
                while (i < len && !(raw[i] === '*' && raw[i + 1] === '/')) {
                    comment += raw[i];
                    i++;
                }
                if (i < len) { comment += '*/'; i += 2; }
                tokens.push({ type: 'comment', value: comment });
                continue;
            }

            // Multi-word clauses check like LEFT JOIN, GROUP BY, ORDER BY
            let matchedMulti = null;
            const remaining = raw.slice(i);
            for (const clause of SQL_MAJOR_CLAUSES) {
                if (clause.includes(' ')) {
                    const regex = new RegExp(`^${clause.replace(/\s+/g, '\\s+')}(?=[\\s,();]|$)`, 'i');
                    const match = remaining.match(regex);
                    if (match) {
                        matchedMulti = { value: match[0], canonical: clause };
                        break;
                    }
                }
            }

            if (matchedMulti) {
                tokens.push({ type: 'clause', value: matchedMulti.canonical });
                i += matchedMulti.value.length;
                continue;
            }

            // Parentheses and punctuation
            if (/^[(),;]/.test(raw[i])) {
                tokens.push({ type: 'punct', value: raw[i] });
                i++;
                continue;
            }

            // Operators
            const opMatch = raw.slice(i).match(/^(>=|<=|!=|<>|::|:=|=|<|>|\+|-|\*|\/|%|\|\|)/);
            if (opMatch) {
                tokens.push({ type: 'operator', value: opMatch[0] });
                i += opMatch[0].length;
                continue;
            }

            // Words (keywords / identifiers / numbers)
            const wordMatch = raw.slice(i).match(/^[a-zA-Z0-9_$.]+/);
            if (wordMatch) {
                const word = wordMatch[0];
                const upper = word.toUpperCase();
                const isClause = SQL_MAJOR_CLAUSES.includes(upper);
                const isKeyword = SQL_ALL_KEYWORDS.includes(upper);

                if (isClause) {
                    tokens.push({ type: 'clause', value: upper });
                } else if (isKeyword) {
                    tokens.push({ type: 'keyword', value: upper });
                } else {
                    tokens.push({ type: 'word', value: word });
                }
                i += word.length;
                continue;
            }

            tokens.push({ type: 'other', value: raw[i] });
            i++;
        }

        // Reconstruct formatted SQL with indentation depth
        let outputText = '';
        let depth = 0;
        let inSubquery = 0;
        let keywordCount = 0;

        const applyCase = (word) => {
            if (keywordCase === 'upper') return word.toUpperCase();
            if (keywordCase === 'lower') return word.toLowerCase();
            return word;
        };

        for (let t = 0; t < tokens.length; t++) {
            const token = tokens[t];
            const prev = t > 0 ? tokens[t - 1] : null;
            const next = t < tokens.length - 1 ? tokens[t + 1] : null;

            if (token.type === 'clause') {
                keywordCount++;
                const clauseName = applyCase(token.value);
                if (t > 0 && outputText.slice(-1) !== '\n') {
                    outputText += '\n';
                }
                outputText += indentStr.repeat(depth) + clauseName + ' ';
            } else if (token.type === 'keyword') {
                keywordCount++;
                const kw = applyCase(token.value);
                if (token.value === 'AND' || token.value === 'OR') {
                    outputText += '\n' + indentStr.repeat(depth + 1) + kw + ' ';
                } else {
                    outputText += kw + (next && next.value !== ',' && next.value !== ')' && next.value !== ';' ? ' ' : '');
                }
            } else if (token.type === 'punct') {
                if (token.value === '(') {
                    outputText += '(';
                    depth++;
                } else if (token.value === ')') {
                    depth = Math.max(0, depth - 1);
                    outputText += ')';
                    if (next && next.value !== ',' && next.value !== ';') outputText += ' ';
                } else if (token.value === ',') {
                    outputText += ', ';
                    if (commaBreak && depth === 0) {
                        outputText += '\n' + indentStr.repeat(depth + 1);
                    }
                } else if (token.value === ';') {
                    outputText += ';\n\n';
                }
            } else if (token.type === 'operator') {
                outputText += (token.value === '::' ? '::' : ` ${token.value} `);
            } else {
                outputText += token.value;
                if (next && next.value !== ',' && next.value !== ';' && next.value !== ')' && next.value !== '(' && next.type !== 'punct') {
                    outputText += ' ';
                }
            }
        }

        // Clean up redundant spaces and trailing empty lines
        const cleaned = outputText
            .split('\n')
            .map(line => line.trimEnd())
            .join('\n')
            .trim();

        return { formatted: cleaned, keywordCount };
    }

    function update() {
        const raw = input.value;
        const validation = validateSQL(raw);

        if (validation.valid) {
            validationMsg.style.color = 'var(--success)';
            validationMsg.innerHTML = `<span>✓</span> <span>${validation.message}</span>`;
        } else {
            validationMsg.style.color = 'var(--error)';
            validationMsg.innerHTML = `<span>✕</span> <span>${validation.message}</span>`;
        }

        const { formatted, keywordCount } = formatSQLString(raw);
        output.value = formatted;

        const lines = formatted ? formatted.split('\n').length : 0;
        statLines.textContent = `Lines: ${lines}`;
        statTokens.textContent = `Keywords: ${keywordCount || 0}`;
        statChars.textContent = `Chars: ${formatted.length}`;
    }

    input.addEventListener('input', Atelier.debounce(update, 100));
    keywordCaseSelect.addEventListener('change', update);
    indentSizeSelect.addEventListener('change', update);
    dialectSelect.addEventListener('change', update);
    commaBreakSelect.addEventListener('change', update);

    clearBtn.addEventListener('click', () => {
        input.value = '';
        output.value = '';
        update();
        input.focus();
    });

    copyBtn.addEventListener('click', () => {
        Atelier.copyToClipboard(output.value, 'SQL query copied to clipboard!');
    });

    minifyBtn.addEventListener('click', () => {
        if (!input.value.trim()) return;
        const minified = input.value
            .replace(/\/\*[\s\S]*?\*\/|--.*$/gm, '')
            .replace(/\s+/g, ' ')
            .trim();
        output.value = minified;
        Atelier.showToast('SQL minified to single line', 'info');
    });

    downloadBtn.addEventListener('click', () => {
        if (!output.value.trim()) {
            Atelier.showToast('No SQL to download', 'warning');
            return;
        }
        Atelier.downloadFile(output.value, `query-${Date.now()}.sql`, 'application/sql');
    });

    // Sample buttons
    document.getElementById('sql-sample-select').addEventListener('click', () => {
        input.value = SAMPLES.select;
        update();
    });
    document.getElementById('sql-sample-crud').addEventListener('click', () => {
        input.value = SAMPLES.crud;
        update();
    });
    document.getElementById('sql-sample-schema').addEventListener('click', () => {
        input.value = SAMPLES.schema;
        update();
    });
    document.getElementById('sql-sample-subquery').addEventListener('click', () => {
        input.value = SAMPLES.subquery;
        update();
    });

    // Initial run with default select sample
    input.value = SAMPLES.select;
    update();
}
