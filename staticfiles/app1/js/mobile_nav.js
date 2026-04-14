document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const menuToggle = document.getElementById('mobileMenuToggle');
    const drawer = document.getElementById('mobileNavDrawer');
    const backdrop = document.getElementById('mobileNavBackdrop');
    const closeBtn = document.getElementById('mobileCloseBtn');
    const userToggles = document.querySelectorAll('[data-user-toggle]');
    const searchToggles = document.querySelectorAll('[data-search-toggle]');
    const searchForms = document.querySelectorAll('[data-search-form]');

    const openDrawer = () => {
        if (!drawer) return;
        drawer.classList.add('is-open');
        drawer.setAttribute('aria-hidden', 'false');
        if (menuToggle) menuToggle.setAttribute('aria-expanded', 'true');
        body.classList.add('mobile-nav-open');
    };

    const closeDrawer = () => {
        if (!drawer) return;
        drawer.classList.remove('is-open');
        drawer.setAttribute('aria-hidden', 'true');
        if (menuToggle) menuToggle.setAttribute('aria-expanded', 'false');
        body.classList.remove('mobile-nav-open');
    };

    const closeAllUserMenus = () => {
        document.querySelectorAll('[data-user-dropdown]').forEach((dropdown) => {
            dropdown.classList.remove('is-open');
        });
        userToggles.forEach((toggle) => toggle.setAttribute('aria-expanded', 'false'));
    };

    const closeAllSearchForms = () => {
        searchForms.forEach((form) => form.classList.remove('is-open'));
        searchToggles.forEach((toggle) => toggle.setAttribute('aria-expanded', 'false'));
    };

    if (menuToggle) menuToggle.addEventListener('click', openDrawer);
    if (backdrop) backdrop.addEventListener('click', closeDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);

    userToggles.forEach((toggle) => {
        const dropdown = toggle.parentElement?.querySelector('[data-user-dropdown]');
        if (!dropdown) return;
        toggle.addEventListener('click', (event) => {
            event.stopPropagation();
            const willOpen = !dropdown.classList.contains('is-open');
            closeAllUserMenus();
            if (willOpen) {
                dropdown.classList.add('is-open');
                toggle.setAttribute('aria-expanded', 'true');
            }
        });
    });

    searchToggles.forEach((toggle) => {
        const form = toggle.parentElement?.querySelector('[data-search-form]');
        if (!form) return;
        toggle.addEventListener('click', (event) => {
            event.stopPropagation();
            const willOpen = !form.classList.contains('is-open');
            closeAllSearchForms();
            if (willOpen) {
                form.classList.add('is-open');
                toggle.setAttribute('aria-expanded', 'true');
                const input = form.querySelector('input');
                if (input) input.focus();
            }
        });
    });

    document.addEventListener('click', (event) => {
        const clickedInsideUser = !!event.target.closest('.user-menu-wrap');
        const clickedInsideSearch = !!event.target.closest('.header-search');
        if (!clickedInsideUser) closeAllUserMenus();
        if (!clickedInsideSearch) closeAllSearchForms();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeDrawer();
            closeAllUserMenus();
            closeAllSearchForms();
        }
    });
});
