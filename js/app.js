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
    
    // Normalize path
    let path = window.location.pathname;
    if (path.endsWith('/') && path.length > 1) {
        path = path.slice(0, -1);
    }
    
    // GitHub Pages usually serves at /atelier
    const pathParts = path.split('/').filter(Boolean);
    const lastSegment = pathParts[pathParts.length - 1];
    
    // If we are at root or just /atelier
    const isHome = !lastSegment || lastSegment === 'atelier';
    
    if (isHome) {
        homeHeader.style.display = 'block';
        navBack.style.display = 'none';
        document.title = 'Atelier — Minimalist Web Utilities';
        if (searchInput) searchInput.value = '';
        renderGrid();
    } else {
        homeHeader.style.display = 'none';
        navBack.style.display = 'block';
        
        const toolId = lastSegment;
        const toolMeta = TOOLS_REGISTRY.find(t => t.id === toolId);
        
        if (toolMeta) {
            document.title = `${toolMeta.title} — Atelier`;
            try {
                // Ensure import path matches github pages and local
                const modulePath = path.includes('/atelier/') ? `/atelier/js/tools/${toolId}.js` : `/js/tools/${toolId}.js`;
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


function renderGrid(searchQuery = '') {
    const basePath = window.location.pathname.includes('/atelier') ? '/atelier' : '';
    
    const lowerQuery = searchQuery.toLowerCase();
    const filteredTools = TOOLS_REGISTRY.filter(t => 
        t.title.toLowerCase().includes(lowerQuery) || 
        t.description.toLowerCase().includes(lowerQuery)
    );

    if (filteredTools.length === 0) {
        appRoot.innerHTML = `<p style="text-align:center; color:var(--text-muted); margin-top: 3rem;">No tools found matching "${searchQuery}"</p>`;
        return;
    }

    const grouped = filteredTools.reduce((acc, tool) => {
        const cat = tool.category || 'Other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(tool);
        return acc;
    }, {});

    let html = '';
    for (const [category, tools] of Object.entries(grouped)) {
        html += `
            <h2 class="category-title">${category}</h2>
            <div class="tools-grid">
                ${tools.map(tool => `
                    <a href="${basePath}/${tool.id}" class="tool-card" data-link>
                        <div>
                            <div class="tool-title">${tool.title}</div>
                            <div class="tool-desc">${tool.description}</div>
                        </div>
                        <div class="arrow">→</div>
                    </a>
                `).join('')}
            </div>
        `;
    }
    appRoot.innerHTML = html;
}

const searchInput = document.getElementById('tool-search');
if (searchInput) {
    searchInput.addEventListener('input', (e) => renderGrid(e.target.value));
}

// Intercept navigation for SPA experience
document.body.addEventListener('click', e => {
    const a = e.target.closest('[data-link]');
    if (a) {
        e.preventDefault();
        history.pushState(null, null, a.href);
        route();
    }
});

window.addEventListener('popstate', route);

// Initial render
document.addEventListener('DOMContentLoaded', route);
