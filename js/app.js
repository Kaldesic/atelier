import { TOOLS_REGISTRY } from './registry.js';

window.Atelier = window.Atelier || {};
window.Atelier.activeUrls = [];
window.Atelier.currentPasteHandler = null;

// Global Paste Event Dispatcher
window.Atelier.setPasteHandler = (fn) => {
    window.Atelier.currentPasteHandler = fn;
};

window.addEventListener('paste', (e) => {
    if (window.Atelier.currentPasteHandler) {
        window.Atelier.currentPasteHandler(e);
    }
});

// Intercept Object URLs to prevent memory leaks globally across all routes
const originalCreate = URL.createObjectURL;
URL.createObjectURL = (obj) => {
    const url = originalCreate.call(URL, obj);
    window.Atelier.activeUrls.push(url);
    return url;
};

function purgeGlobalMemory() {
    window.Atelier.activeUrls.forEach(url => URL.revokeObjectURL(url));
    window.Atelier.activeUrls = [];
    window.Atelier.currentPasteHandler = null;
}

const appRoot = document.getElementById('app-root');
const homeHeader = document.getElementById('home-header');
const navBack = document.getElementById('nav-back');

async function route() {
    purgeGlobalMemory();
    
    // Get path from hash, default to empty (home)
    const hash = window.location.hash.replace('#', '');
    const isHome = !hash || hash === '/';
    
    if (isHome) {
        homeHeader.style.display = 'block';
        navBack.style.display = 'none';
        document.title = 'Atelier — Minimalist Web Utilities';
        if (searchInput) searchInput.value = '';
        renderGrid();
    } else {
        homeHeader.style.display = 'none';
        navBack.style.display = 'block';
        
        // Remove leading slash if present
        const toolId = hash.startsWith('/') ? hash.slice(1) : hash;
        const toolMeta = TOOLS_REGISTRY.find(t => t.id === toolId);
        
        if (toolMeta) {
            document.title = `${toolMeta.title} — Atelier`;
            try {
                // Dynamic import relative to app.js
                const modulePath = `./tools/${toolId}.js`;
                const module = await import(modulePath);
                appRoot.innerHTML = module.html;
                if (module.init) module.init();
            } catch (e) {
                console.error('Failed to load tool:', e);
                appRoot.innerHTML = `<p style="color:var(--error)">Failed to load tool module. Check console for details.</p>`;
            }
        } else {
            appRoot.innerHTML = `<h1>404</h1><p style="color:var(--text-muted)">Tool not found.</p>`;
        }
    }
}


function getFavorites() {
    try {
        const raw = localStorage.getItem('atelier-favorites');
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function toggleFavorite(toolId) {
    let favs = getFavorites();
    if (favs.includes(toolId)) {
        favs = favs.filter(id => id !== toolId);
    } else {
        favs.push(toolId);
    }
    localStorage.setItem('atelier-favorites', JSON.stringify(favs));
    renderGrid(searchInput ? searchInput.value : '');
}

const STAR_OUTLINE = `<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;

function renderToolCard(tool, isPinned) {
    return `
        <a href="#/${tool.id}" class="tool-card" data-link>
            <div style="flex: 1;">
                <div class="tool-title">${tool.title}</div>
                <div class="tool-desc">${tool.description}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <button class="tool-pin-btn ${isPinned ? 'is-pinned' : ''}" data-pin-id="${tool.id}" title="${isPinned ? 'Unpin tool' : 'Pin to favorites'}" aria-label="Pin tool">
                    ${STAR_OUTLINE}
                </button>
                <div class="arrow">→</div>
            </div>
        </a>
    `;
}

let activeCategoryFilter = 'ALL';

function renderGrid(searchQuery = '') {
    const basePath = '#/';
    const favorites = getFavorites();
    
    const lowerQuery = searchQuery.toLowerCase();
    let filteredTools = TOOLS_REGISTRY.filter(t => 
        t.title.toLowerCase().includes(lowerQuery) || 
        t.description.toLowerCase().includes(lowerQuery)
    );

    if (activeCategoryFilter !== 'ALL') {
        filteredTools = filteredTools.filter(t => t.category === activeCategoryFilter);
    }

    if (filteredTools.length === 0) {
        appRoot.innerHTML = `<p style="text-align:center; color:var(--text-muted); margin-top: 3rem;">No tools found matching your search or category filter.</p>`;
        return;
    }

    let html = '';

    // If there are pinned tools, no search filter and ALL category, show pinned shelf at top
    if (favorites.length > 0 && !searchQuery && activeCategoryFilter === 'ALL') {
        const pinnedTools = TOOLS_REGISTRY.filter(t => favorites.includes(t.id));
        if (pinnedTools.length > 0) {
            html += `
                <div class="category-group pinned-group">
                    <h2 class="category-title">★ Pinned Favorites</h2>
                    <div class="tools-grid">
                        ${pinnedTools.map(tool => renderToolCard(tool, true)).join('')}
                    </div>
                </div>
            `;
        }
    }

    const grouped = filteredTools.reduce((acc, tool) => {
        const cat = tool.category || 'Other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(tool);
        return acc;
    }, {});

    html += '<div class="categories-container">';
    for (const [category, tools] of Object.entries(grouped)) {
        html += `
            <div class="category-group">
                <h2 class="category-title">${category}</h2>
                <div class="tools-grid">
                    ${tools.map(tool => renderToolCard(tool, favorites.includes(tool.id))).join('')}
                </div>
            </div>
        `;
    }
    html += '</div>';
    appRoot.innerHTML = html;

    // Attach pin toggle event listeners
    appRoot.querySelectorAll('.tool-pin-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const id = e.currentTarget.getAttribute('data-pin-id');
            if (id) toggleFavorite(id);
        });
    });
}

const searchInput = document.getElementById('tool-search');
if (searchInput) {
    searchInput.addEventListener('input', (e) => renderGrid(e.target.value));
}

// Category filter button clicks
document.querySelectorAll('.cat-filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        document.querySelectorAll('.cat-filter-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        activeCategoryFilter = e.currentTarget.getAttribute('data-category');
        renderGrid(searchInput ? searchInput.value : '');
    });
});


// Hash-based SPA routing
window.addEventListener('hashchange', route);
// Initial render
document.addEventListener('DOMContentLoaded', route);



// Register Service Worker & PWA Install Prompt
let deferredPrompt = null;
const pwaBanner = document.getElementById('pwa-install-banner');
const pwaInstallBtn = document.getElementById('pwa-install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (pwaBanner) pwaBanner.classList.add('show');
});

if (pwaInstallBtn) {
    pwaInstallBtn.addEventListener('click', async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            deferredPrompt = null;
            if (pwaBanner) pwaBanner.classList.remove('show');
        }
    });
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/atelier/sw.js')
            .then(reg => console.log('ServiceWorker registration successful with scope: ', reg.scope))
            .catch(err => console.error('ServiceWorker registration failed: ', err));
    });
}

// --- Global Drag and Drop Router ---
const globalDropzone = document.getElementById('global-dropzone');
let dragCounter = 0;

window.addEventListener('dragenter', (e) => {
    e.preventDefault();
    dragCounter++;
    if (globalDropzone && dragCounter === 1) {
        globalDropzone.classList.add('active');
    }
});

window.addEventListener('dragleave', (e) => {
    e.preventDefault();
    dragCounter--;
    if (globalDropzone && dragCounter <= 0) {
        dragCounter = 0;
        globalDropzone.classList.remove('active');
    }
});

window.addEventListener('dragover', (e) => {
    e.preventDefault();
});

window.addEventListener('drop', (e) => {
    e.preventDefault();
    dragCounter = 0;
    if (globalDropzone) globalDropzone.classList.remove('active');

    const files = e.dataTransfer?.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const name = file.name.toLowerCase();

    // Smart route based on dropped file type
    if (name.endsWith('.svg')) {
        window.location.hash = '#/svg-cleaner';
    } else if (name.endsWith('.json')) {
        window.location.hash = '#/json-formatter';
    } else if (name.endsWith('.md') || name.endsWith('.markdown')) {
        window.location.hash = '#/markdown-previewer';
    } else if (file.type.startsWith('image/')) {
        window.location.hash = '#/image-compressor';
    }
});

// --- Theme Management ---
const SUN_ICON = `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
const MOON_ICON = `<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

function updateThemeIcons(theme) {
    const icon = theme === 'dark' ? SUN_ICON : MOON_ICON;
    const label = theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
    const btns = [document.getElementById('theme-toggle-home'), document.getElementById('theme-toggle-tool')];
    btns.forEach(btn => {
        if (btn) {
            btn.innerHTML = icon;
            btn.setAttribute('title', label);
            btn.setAttribute('aria-label', label);
        }
    });
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', nextTheme);
    localStorage.setItem('atelier-theme', nextTheme);
    updateThemeIcons(nextTheme);
}

document.querySelectorAll('.theme-toggle-btn').forEach(btn => {
    btn.addEventListener('click', toggleTheme);
});

// Sync initial icon state
const initialTheme = document.documentElement.getAttribute('data-theme') || 'dark';
updateThemeIcons(initialTheme);

// --- Global Keyboard Shortcuts ---
window.addEventListener('keydown', (e) => {
    const isSearchFocused = document.activeElement === searchInput;
    const isInsideInput = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);

    // Ctrl+K, Cmd+K, or '/' to focus search on home view
    if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') || (e.key === '/' && !isInsideInput)) {
        const hash = window.location.hash.replace('#', '');
        const isHome = !hash || hash === '/';
        if (isHome && searchInput) {
            e.preventDefault();
            searchInput.focus();
            searchInput.select();
        }
    }

    // Escape: clear search or return back to home
    if (e.key === 'Escape') {
        if (isSearchFocused && searchInput.value) {
            searchInput.value = '';
            renderGrid('');
            searchInput.blur();
        } else if (window.location.hash && window.location.hash !== '#/' && window.location.hash !== '#') {
            window.location.hash = '#/';
        }
    }
});

