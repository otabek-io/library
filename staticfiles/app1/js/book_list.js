// Ko'rinishni o'zgartirish (grid/list)
document.addEventListener('DOMContentLoaded', function() {
    const viewButtons = document.querySelectorAll('.view-btn');
    const booksContainer = document.getElementById('books-container');

    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Faol tugmani o'zgartirish
            viewButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Ko'rinishni o'zgartirish
            const viewType = this.getAttribute('data-view');
            booksContainer.classList.remove('grid-view', 'list-view');
            booksContainer.classList.add(`${viewType}-view`);

            // Ko'rinishni localStorage ga saqlash
            localStorage.setItem('bookView', viewType);
        });
    });

    // Oldingi ko'rinishni yuklash
    const savedView = localStorage.getItem('bookView');
    if (savedView) {
        const activeBtn = document.querySelector(`.view-btn[data-view="${savedView}"]`);
        if (activeBtn) {
            viewButtons.forEach(btn => btn.classList.remove('active'));
            activeBtn.classList.add('active');
            booksContainer.classList.remove('grid-view', 'list-view');
            booksContainer.classList.add(`${savedView}-view`);
        }
    }

    // Sevimlilarga qo'shish
    const favoriteButtons = document.querySelectorAll('.favorite-btn');

    favoriteButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();

            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.style.color = '#e74c3c';

                // Animation
                this.style.transform = 'scale(1.5)';
                setTimeout(() => {
                    this.style.transform = 'scale(1)';
                }, 300);
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.style.color = '';
            }
        });
    });

    // Kitob kartalariga hover effekti
    const bookCards = document.querySelectorAll('.book-card');

    bookCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const image = this.querySelector('img');
            image.style.transform = 'scale(1.05)';
        });

        card.addEventListener('mouseleave', function() {
            const image = this.querySelector('img');
            image.style.transform = 'scale(1)';
        });
    });

    // Pagination tugmalari
    const pageButtons = document.querySelectorAll('.page-btn:not(.prev):not(.next)');

    pageButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();

            pageButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // Search funksiyasi (demo)
    const searchInput = document.querySelector('.search-box input');
    const searchBtn = document.querySelector('.search-btn');

    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            const query = searchInput.value.trim();
            if (query) {
                alert(`"${query}" so'zi bo'yicha qidiruv natijalari (demo)`);
                // Bu yerda haqiqiy qidiruv logikasi bo'ladi
            }
        });

        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchBtn.click();
            }
        });
    }
});