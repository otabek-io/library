document.addEventListener('DOMContentLoaded', function() {
    // 1. AOS (Animate On Scroll) ishga tushirish
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
            once: true,
            offset: 50
        });
    }

    // 2. View Toggle (Grid/List ko'rinishni almashtirish)
    const viewBtns = document.querySelectorAll('.view-btn');
    const booksContainer = document.getElementById('books-container');

    if (viewBtns.length > 0 && booksContainer) {
        viewBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const view = this.dataset.view;

                // Aktiv klassni boshqarish
                viewBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');

                // Konteyner klassini o'zgartirish
                if (view === 'grid') {
                    booksContainer.classList.replace('list-view', 'grid-view');
                } else {
                    booksContainer.classList.replace('grid-view', 'list-view');
                }

                // Foydalanuvchi tanlovini xotirada saqlash
                localStorage.setItem('booksView', view);
            });
        });

        // Saqlangan ko'rinishni yuklash
        const savedView = localStorage.getItem('booksView');
        if (savedView) {
            const targetBtn = document.querySelector(`.view-btn[data-view="${savedView}"]`);
            if (targetBtn) {
                targetBtn.click(); // Saqlangan holatni avtomatik yoqish
            }
        }
    }

    // 3. Number Counter Animatsiyasi (Statistika bo'limi uchun)
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimated = false;

    function animateNumbers() {
        statNumbers.forEach(numberEl => {
            const targetStr = numberEl.getAttribute('data-count');
            const target = parseFloat(targetStr);
            const isFloat = targetStr.includes('.');

            const duration = 2000; // 2 soniya
            const frameRate = 1000 / 60; // 60fps
            const totalFrames = Math.round(duration / frameRate);
            let currentFrame = 0;

            const increment = target / totalFrames;

            const timer = setInterval(() => {
                currentFrame++;
                const currentVal = increment * currentFrame;

                if (isFloat) {
                    numberEl.textContent = currentVal.toFixed(1);
                } else {
                    numberEl.textContent = Math.round(currentVal);
                }

                if (currentFrame >= totalFrames) {
                    clearInterval(timer);
                    numberEl.textContent = targetStr; // Aniq qiymatni qo'yish
                }
            }, frameRate);
        });
    }

    // Statistika qismi ekranga kelgandagina animatsiyani ishga tushirish (IntersectionObserver)
    const statsSection = document.querySelector('.stats-section');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !hasAnimated) {
                animateNumbers();
                hasAnimated = true;
                observer.unobserve(statsSection);
            }
        }, { threshold: 0.5 });

        observer.observe(statsSection);
    }
});