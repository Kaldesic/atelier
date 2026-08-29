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
                console.error('Failed to load tool module:', e);
                appRoot.innerHTML = `
                    <div class="tool-section" style="border-color: var(--error);">
                        <h2 style="color: var(--error); margin-bottom: 0.5rem;">Module Load Error</h2>
                        <p style="color: var(--text-muted); margin-bottom: 1rem;">Could not load the requested tool module. Please verify your offline cache or refresh.</p>
                        <a href="#/" class="btn btn-outline">← Back to Overview</a>
                    </div>
                `;
            }
        } else {
            appRoot.innerHTML = `
                <div class="tool-section" style="text-align: center; padding: 3rem 1rem;">
                    <h1 style="font-size: 3rem; margin-bottom: 0.5rem;">404</h1>
                    <p style="color:var(--text-muted); margin-bottom: 1.5rem;">Tool "${toolId}" was not found in the suite registry.</p>
                    <a href="#/" class="btn btn-primary">Return to Atelier Tools</a>
                </div>
            `;
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

const STAR_OUTLINE = `<svg viewBox="0 0 24 24" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;

function renderToolCard(tool, isPinned) {
    return `
        <a href="#/${tool.id}" class="tool-card" data-link aria-label="${tool.title} - ${tool.description}">
            <div style="flex: 1;">
                <div class="tool-title">${tool.title}</div>
                <div class="tool-desc">${tool.description}</div>
            </div>
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <button class="tool-pin-btn ${isPinned ? 'is-pinned' : ''}" data-pin-id="${tool.id}" title="${isPinned ? 'Unpin tool' : 'Pin to favorites'}" aria-label="${isPinned ? 'Unpin' : 'Pin'} ${tool.title}" type="button">
                    ${STAR_OUTLINE}
                </button>
                <div class="arrow" aria-hidden="true">→</div>
            </div>
        </a>
    `;
}

let activeCategoryFilter = 'ALL';

function renderGrid(searchQuery = '') {
    const favorites = getFavorites();
    const lowerQuery = searchQuery.toLowerCase();

    let filteredTools = TOOLS_REGISTRY.filter(t => 
        t.title.toLowerCase().includes(lowerQuery) || 
        t.description.toLowerCase().includes(lowerQuery) ||
        t.category.toLowerCase().includes(lowerQuery)
    );

    if (activeCategoryFilter !== 'ALL') {
        filteredTools = filteredTools.filter(t => t.category === activeCategoryFilter);
    }

    if (filteredTools.length === 0) {
        appRoot.innerHTML = `
            <div style="text-align:center; padding: 3rem 1rem; color:var(--text-muted);">
                <p style="font-size: 1.1rem; margin-bottom: 0.5rem;">No tools found matching "<strong>${searchQuery}</strong>"</p>
                <button class="btn btn-outline" id="clearFilterBtn" style="margin-top: 0.75rem;">Reset Search & Filters</button>
            </div>
        `;
        const resetBtn = document.getElementById('clearFilterBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                activeCategoryFilter = 'ALL';
                document.querySelectorAll('.cat-filter-btn').forEach(b => {
                    b.classList.toggle('active', b.getAttribute('data-category') === 'ALL');
                });
                renderGrid('');
            });
        }
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
            await deferredPrompt.userChoice;
            deferredPrompt = null;
            if (pwaBanner) pwaBanner.classList.remove('show');
        }
    });
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        const swPath = window.location.pathname.includes('/atelier') ? '/atelier/sw.js' : '/sw.js';
        navigator.serviceWorker.register(swPath)
            .then(reg => {
                // Check for updates
                reg.addEventListener('updatefound', () => {
                    const newWorker = reg.installing;
                    if (newWorker) {
                        newWorker.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                window.Atelier.showToast('Atelier updated! Refresh for latest tools.', 'info');
                            }
                        });
                    }
                });
            })
            .catch(err => console.error('ServiceWorker registration error:', err));
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
    } else if (name.endsWith('.sql')) {
        window.location.hash = '#/sql-formatter';
    } else if (name.endsWith('.md') || name.endsWith('.markdown')) {
        window.location.hash = '#/markdown-previewer';
    } else if (file.type.startsWith('image/')) {
        window.location.hash = '#/image-compressor';
    }
});

// --- Theme Management ---
const SUN_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
const MOON_ICON = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;

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

// --- Legal & Privacy Modal Listeners ---
const openLegalBtn = document.getElementById('openLegalModalBtn');
const closeLegalBtn = document.getElementById('closeLegalModalBtn');
const legalModal = document.getElementById('legalModal');

if (openLegalBtn) {
    openLegalBtn.addEventListener('click', () => {
        window.Atelier.openModal('legalModal');
    });
}

if (closeLegalBtn) {
    closeLegalBtn.addEventListener('click', () => {
        window.Atelier.closeModal('legalModal');
    });
}

if (legalModal) {
    legalModal.addEventListener('click', (e) => {
        if (e.target === legalModal) {
            window.Atelier.closeModal('legalModal');
        }
    });
}

// --- Global Keyboard Shortcuts ---
window.addEventListener('keydown', (e) => {
    const isModalOpen = legalModal && legalModal.classList.contains('active');
    const isSearchFocused = document.activeElement === searchInput;
    const isInsideInput = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName);

    // Escape handling
    if (e.key === 'Escape') {
        if (isModalOpen) {
            window.Atelier.closeModal('legalModal');
            return;
        }
        if (isSearchFocused && searchInput.value) {
            searchInput.value = '';
            renderGrid('');
            searchInput.blur();
        } else if (window.location.hash && window.location.hash !== '#/' && window.location.hash !== '#') {
            window.location.hash = '#/';
        }
    }

    // Ctrl+K, Cmd+K, or '/' to focus search on home view
    if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') || (e.key === '/' && !isInsideInput && !isModalOpen)) {
        const hash = window.location.hash.replace('#', '');
        const isHome = !hash || hash === '/';
        if (isHome && searchInput) {
            e.preventDefault();
            searchInput.focus();
            searchInput.select();
        }
    }
});
