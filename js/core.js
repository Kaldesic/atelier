/**
 * Atelier Core Engine - v2.0.0
 * 100% Client-side utility library for Atelier PWA suite.
 * Centralized helpers, accessible modals, and memory-safe file operations.
 */

window.Atelier = {
    
    /**
     * Display a temporary toast notification.
     * @param {string} message - Text to display
     * @param {string} type - 'success' | 'error' | 'info' | 'warning'
     */
    showToast(message, type = 'success') {
        let container = document.getElementById('atelier-toast-container');
        if (!container) {
            container = document.createElement('div');
            container.id = 'atelier-toast-container';
            Object.assign(container.style, {
                position: 'fixed',
                bottom: '24px',
                right: '24px',
                zIndex: '9999',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                pointerEvents: 'none'
            });
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        const borderColor = type === 'success' ? '#34d399' : type === 'error' ? '#f87171' : type === 'warning' ? '#eab308' : '#38bdf8';
        
        Object.assign(toast.style, {
            background: 'var(--card-bg, #161920)',
            color: 'var(--text, #e2e8f0)',
            padding: '12px 18px',
            borderRadius: '8px',
            border: `1px solid ${borderColor}`,
            fontSize: '14px',
            fontFamily: 'var(--font-sans, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif)',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
            opacity: '0',
            transform: 'translateY(10px)',
            transition: 'opacity 0.25s ease, transform 0.25s ease',
            pointerEvents: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
        });

        const icon = type === 'success' ? '✓' : type === 'error' ? '✕' : type === 'warning' ? '⚠' : 'ℹ';
        toast.innerHTML = `<span style="color:${borderColor}; font-weight:bold;">${icon}</span> <span>${message}</span>`;
        container.appendChild(toast);

        // Trigger entrance animation
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
            toast.style.transform = 'translateY(0)';
        });

        // Dismiss timer
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateY(10px)';
            setTimeout(() => toast.remove(), 250);
        }, 3000);
    },

    /**
     * Copy text to clipboard with toast notification.
     * @param {string} text 
     * @param {string} successMessage 
     */
    async copyToClipboard(text, successMessage = 'Copied to clipboard!') {
        if (!text) {
            this.showToast('Nothing to copy', 'warning');
            return;
        }
        try {
            if (navigator.clipboard && window.isSecureContext) {
                await navigator.clipboard.writeText(text);
            } else {
                const textarea = document.createElement('textarea');
                textarea.value = text;
                textarea.style.position = 'fixed';
                textarea.style.left = '-999999px';
                textarea.style.top = '-999999px';
                document.body.appendChild(textarea);
                textarea.focus();
                textarea.select();
                document.execCommand('copy');
                textarea.remove();
            }
            this.showToast(successMessage, 'success');
        } catch (err) {
            console.error('Copy failed:', err);
            this.showToast('Failed to copy to clipboard', 'error');
        }
    },

    /**
     * Download text or binary blob as a file.
     * @param {string|Blob} content 
     * @param {string} filename 
     * @param {string} mimeType 
     */
    downloadFile(content, filename, mimeType = 'text/plain') {
        const blob = content instanceof Blob ? content : new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 1000);
        this.showToast(`Downloaded ${filename}`, 'success');
    },

    /**
     * Initialize a standardized drag-and-drop zone.
     * @param {string} dropZoneId - ID of container element
     * @param {string} fileInputId - ID of hidden <input type="file"> element
     * @param {Function} onFileSelected - Callback receiving the selected File object
     */
    initDropZone(dropZoneId, fileInputId, onFileSelected) {
        const dropZone = document.getElementById(dropZoneId);
        const fileInput = document.getElementById(fileInputId);
        if (!dropZone || !fileInput) return;

        const highlight = () => dropZone.classList.add('drag-over');
        const unhighlight = () => dropZone.classList.remove('drag-over');

        ['dragenter', 'dragover'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                highlight();
            }, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                unhighlight();
            }, false);
        });

        dropZone.addEventListener('drop', (e) => {
            const files = e.dataTransfer.files;
            if (files.length > 0 && typeof onFileSelected === 'function') {
                onFileSelected(files[0]);
            }
        });

        fileInput.addEventListener('change', (e) => {
            const files = e.target.files;
            if (files.length > 0 && typeof onFileSelected === 'function') {
                onFileSelected(files[0]);
            }
        });

        dropZone.addEventListener('click', () => fileInput.click());
    },

    /**
     * Format file size in bytes to a human-readable string.
     * @param {number} bytes 
     * @returns {string}
     */
    formatBytes(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    /**
     * Debounce utility for input handlers.
     * @param {Function} fn 
     * @param {number} wait 
     * @returns {Function}
     */
    debounce(fn, wait = 150) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => fn.apply(this, args), wait);
        };
    },

    /**
     * Open an accessible modal with focus trap.
     * @param {string} modalId 
     */
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        modal.classList.add('active');
        modal.setAttribute('aria-hidden', 'false');
        
        // Save previous active element to restore focus on close
        modal._previousActive = document.activeElement;
        
        // Focus first actionable element
        const focusable = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
        if (focusable.length > 0) {
            focusable[0].focus();
        }

        // Keydown listener for Escape and Tab trap
        modal._keyHandler = (e) => {
            if (e.key === 'Escape') {
                this.closeModal(modalId);
            } else if (e.key === 'Tab') {
                const focusableArr = Array.from(focusable);
                if (focusableArr.length === 0) return;
                const first = focusableArr[0];
                const last = focusableArr[focusableArr.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    last.focus();
                    e.preventDefault();
                } else if (!e.shiftKey && document.activeElement === last) {
                    first.focus();
                    e.preventDefault();
                }
            }
        };
        window.addEventListener('keydown', modal._keyHandler);
    },

    /**
     * Close modal dialog.
     * @param {string} modalId 
     */
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        modal.classList.remove('active');
        modal.setAttribute('aria-hidden', 'true');
        if (modal._keyHandler) {
            window.removeEventListener('keydown', modal._keyHandler);
        }
        if (modal._previousActive && typeof modal._previousActive.focus === 'function') {
            modal._previousActive.focus();
        }
    }
};
