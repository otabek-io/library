// messages.js - Professional versiya

function setupMangaAlerts() {
    document.querySelectorAll('.manga-toast[data-auto-dismiss]').forEach(toast => {
        const dismissTime = parseInt(toast.getAttribute('data-auto-dismiss')) || 5000;

        // Progress bar animatsiyasiga vaqt berish
        const progressBar = toast.querySelector('.manga-toast-progress-bar');
        if (progressBar) {
            progressBar.style.animationDuration = `${dismissTime}ms`;
        }

        // Avtomatik yopilish taymeri
        const timer = setTimeout(() => {
            closeMangaToast(toast);
        }, dismissTime);

        toast.dataset.timerId = timer;

        // Sichqoncha borganda vaqtni to'xtatish
        toast.addEventListener('mouseenter', function() {
            if (progressBar) progressBar.style.animationPlayState = 'paused';
            if (this.dataset.timerId) clearTimeout(parseInt(this.dataset.timerId));
        });

        // Sichqoncha olinganda vaqtni davom ettirish
        toast.addEventListener('mouseleave', function() {
            if (progressBar) progressBar.style.animationPlayState = 'running';

            // Qolgan vaqtni hisoblash va yangi taymer qo'yish
            const computedStyle = window.getComputedStyle(progressBar);
            const matrix = new WebKitCSSMatrix(computedStyle.transform);
            const remainingScale = matrix.a; // scaleX qiymatini olish
            const remainingTime = dismissTime * remainingScale;

            this.dataset.timerId = setTimeout(() => {
                closeMangaToast(toast);
            }, remainingTime);
        });

        // Yopish tugmasiga hodisa qo'shish
        const closeBtn = toast.querySelector('.manga-toast-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeMangaToast(toast));
        }
    });
}

function closeMangaToast(toast) {
    if (!toast || toast.classList.contains('closing')) return;

    toast.classList.add('closing');

    // Taymerni tozalash
    if (toast.dataset.timerId) {
        clearTimeout(parseInt(toast.dataset.timerId));
    }

    // Chiqib ketish animatsiyasini berish
    toast.style.animation = 'slideOutRight 0.4s cubic-bezier(0.4, 0, 0.2, 1) forwards';

    // Animatsiya tugagandan so'ng HTML dan olib tashlash
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 400);
}

// Sahifa yuklanganda ishga tushirish
document.addEventListener('DOMContentLoaded', setupMangaAlerts);