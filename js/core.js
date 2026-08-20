/**
 * Atelier Core Engine - v1.0.0
 * 100% Client-side utility library for Atelier PWA suite.
 */

window.Atelier = {
    
    /**
     * Display a temporary toast notification.
     * @param {string} message - Text to display
     * @param {string} type - 'success' | 'error' | 'info'
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
        const borderColor = type === 'success' ? '#34d399' : type === 'error' ? '#f87171' : '#38bdf8';
        
        Object.assign(toast.style, {
            background: '#161920',
            color: '#e2e8f0',
            padding: '12px 18px',
            borderRadius: '8px',
            border: `1px solid ${borderColor}`,
            fontSize: '14px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
            opacity: '0',
            transform: 'translateY(10px)',
            transition: 'opacity 0.25s ease, transform 0.25s ease',
            pointerEvents: 'auto'
        });
        
        toast.textContent = message;
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
     * Initialize a standardized drag-and-drop zone.
     * @param {string} dropZoneId - ID of container element
     * @param {string} fileInputId - ID of hidden <input type="file"> element
     * @param {Function} onFileSelected - Callback receiving the selected File object
     */
    initDropZone(dropZoneId, fileInputId, onFileSelected) {
        const dropZone = document.getElementById(dropZoneId);
        const fileInput = document.getElementById(fileInputId);
        if (!dropZone || !fileInput) return;

        const highlight = () => dropZone.style.borderColor = '#38bdf8';
        const unhighlight = () => dropZone.style.borderColor = '#1e293b';

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
    }
};
