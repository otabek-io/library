document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS (Animate On Scroll)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            duration: 800,
            easing: 'ease-out',
            once: true,
            offset: 100
        });
    }

    // View Toggle (Grid/List)
    const viewBtns = document.querySelectorAll('.view-btn');
    const booksContainer = document.getElementById('books-container');

    viewBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const view = this.dataset.view;

            // Remove active class from all buttons
            viewBtns.forEach(b => b.classList.remove('active'));

            // Add active class to clicked button
            this.classList.add('active');

            // Update container view
            if (view === 'grid') {
                booksContainer.classList.remove('list-view');
                booksContainer.classList.add('grid-view');
            } else {
                booksContainer.classList.remove('grid-view');
                booksContainer.classList.add('list-view');
            }

            // Save preference to localStorage
            localStorage.setItem('booksView', view);
        });
    });

    // Load saved view preference
    const savedView = localStorage.getItem('booksView');
    if (savedView) {
        const targetBtn = document.querySelector(`.view-btn[data-view="${savedView}"]`);
        if (targetBtn) {
            targetBtn.click();
        }
    }

    // Favorite Button Functionality
    const favoriteBtns = document.querySelectorAll('.favorite-btn-main');

    favoriteBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const bookId = this.dataset.id;
            const url = this.dataset.url;
            const heartIcon = this.querySelector('svg');

            // Toggle filled class
            heartIcon.classList.toggle('filled');

            // Animate button
            this.style.transform = 'scale(1.2)';
            setTimeout(() => {
                this.style.transform = 'scale(1)';
            }, 200);

            // Here you would make an AJAX call to like/unlike the book
            // For now, we'll just toggle the visual state
            console.log('Book ' + bookId + ' favorite toggled');
        });
    });

    // Smooth Scroll to Books Section
    const filterForm = document.querySelector('.filter-form');
    if (filterForm) {
        filterForm.addEventListener('submit', function(e) {
            setTimeout(() => {
                const booksSection = document.querySelector('.books-section');
                if (booksSection) {
                    booksSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        });
    }

    // Animated Counter for Statistics
    function animateCounter(element) {
        const target = parseFloat(element.dataset.count);
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;

        const isDecimal = target % 1 !== 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                element.textContent = isDecimal ? target.toFixed(1) : Math.floor(target) + '+';
                clearInterval(timer);
            } else {
                element.textContent = isDecimal ? current.toFixed(1) : Math.floor(current) + '+';
            }
        }, 16);
    }

    // Intersection Observer for Stats Animation
    const statNumbers = document.querySelectorAll('.stat-number');
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
                entry.target.classList.add('animated');
                animateCounter(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });

    // Book Card Hover Effect Enhancement
    const bookCards = document.querySelectorAll('.book-card');

    bookCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });

        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });

    // Image Lazy Loading Fallback
    const images = document.querySelectorAll('.book-image[loading="lazy"]');

    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            });
        });

        images.forEach(img => imageObserver.observe(img));
    }

    // Pagination Smooth Scroll
    const paginationLinks = document.querySelectorAll('.page-btn');

    paginationLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            setTimeout(() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 100);
        });
    });

    // Handle Like Button HTMX Response
    document.body.addEventListener('htmx:afterSwap', function(event) {
        if (event.detail.target.id && event.detail.target.id.startsWith('like-section-')) {
            const likeBtn = event.detail.target.closest('.book-badge-wrapper').querySelector('.like-btn');
            if (likeBtn) {
                likeBtn.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    likeBtn.style.transform = 'scale(1)';
                }, 300);
            }
        }
    });

    // Category Select Enhancement
    const categorySelect = document.querySelector('.category-select');
    if (categorySelect) {
        categorySelect.addEventListener('change', function() {
            this.style.borderColor = '#667eea';
            setTimeout(() => {
                this.style.borderColor = '';
            }, 300);
        });
    }

    // Add scroll reveal animation for book cards
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    bookCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(card);
    });

    // Prevent context menu on images
    const bookImages = document.querySelectorAll('.book-image');
    bookImages.forEach(img => {
        img.addEventListener('contextmenu', e => e.preventDefault());
    });

    // Add ripple effect to buttons
    function createRipple(event) {
        const button = event.currentTarget;
        const circle = document.createElement('span');
        const diameter = Math.max(button.clientWidth, button.clientHeight);
        const radius = diameter / 2;

        circle.style.width = circle.style.height = `${diameter}px`;
        circle.style.left = `${event.clientX - button.offsetLeft - radius}px`;
        circle.style.top = `${event.clientY - button.offsetTop - radius}px`;
        circle.classList.add('ripple');

        const ripple = button.getElementsByClassName('ripple')[0];
        if (ripple) {
            ripple.remove();
        }

        button.appendChild(circle);
    }

    const buttons = document.querySelectorAll('.filter-btn, .add-book-btn, .page-btn');
    buttons.forEach(button => {
        button.addEventListener('click', createRipple);
    });

    // Add CSS for ripple effect
    const style = document.createElement('style');
    style.textContent = `
        .ripple {
            position: absolute;
            border-radius: 50%;
            background-color: rgba(255, 255, 255, 0.6);
            width: 100px;
            height: 100px;
            animation: ripple-animation 0.6s;
            pointer-events: none;
        }

        @keyframes ripple-animation {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }

        button {
            position: relative;
            overflow: hidden;
        }
    `;
    document.head.appendChild(style);

    console.log('Book List JS initialized successfully!');
});