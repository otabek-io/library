// messages.js - Sodda versiya

// Auto dismiss function
function setupMangaAlerts() {
    document.querySelectorAll('.manga-alert[data-auto-dismiss]').forEach(alert => {
        const dismissTime = parseInt(alert.getAttribute('data-auto-dismiss')) || 5000;

        // Start progress bar
        const progressBar = alert.querySelector('.manga-alert-progress-bar');
        if (progressBar) {
            progressBar.style.animationDuration = dismissTime + 'ms';
        }

        // Auto dismiss timer
        const timer = setTimeout(() => {
            closeMangaAlert(alert.querySelector('.manga-alert-close'));
        }, dismissTime);

        // Store timer reference
        alert.dataset.timerId = timer;

        // Pause on hover
        alert.addEventListener('mouseenter', function() {
            const progressBar = this.querySelector('.manga-alert-progress-bar');
            if (progressBar) {
                progressBar.style.animationPlayState = 'paused';
            }
            if (this.dataset.timerId) {
                clearTimeout(parseInt(this.dataset.timerId));
            }
        });

        // Resume on mouse leave
        alert.addEventListener('mouseleave', function() {
            const progressBar = this.querySelector('.manga-alert-progress-bar');
            if (progressBar) {
                progressBar.style.animationPlayState = 'running';
            }

            const dismissTime = parseInt(this.getAttribute('data-auto-dismiss')) || 5000;
            const remainingTime = dismissTime * (progressBar.offsetWidth / progressBar.parentElement.offsetWidth);

            this.dataset.timerId = setTimeout(() => {
                closeMangaAlert(this.querySelector('.manga-alert-close'));
            }, remainingTime);
        });
    });
}

// Close alert function
function closeMangaAlert(closeBtn) {
    const alert = closeBtn.closest('.manga-alert');
    if (!alert) return;

    // Clear timer if exists
    if (alert.dataset.timerId) {
        clearTimeout(parseInt(alert.dataset.timerId));
    }

    // Add exit animation
    alert.style.animation = 'mangaAlertOut 0.5s cubic-bezier(0.4, 0, 0.2, 1) forwards';

    // Remove element after animation
    setTimeout(() => {
        if (alert.parentNode) {
            alert.parentNode.removeChild(alert);
        }
    }, 500);
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', setupMangaAlerts);