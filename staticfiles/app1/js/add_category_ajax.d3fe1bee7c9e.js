document.getElementById('saveCategoryBtn').addEventListener('click', function() {
    const nameInput = document.getElementById('new_cat_name');
    const name = nameInput.value;
    const csrfTokenElement = document.querySelector('[name=csrfmiddlewaretoken]');
    const errorDiv = document.getElementById('cat_error');

    // 1. CSRF token borligini tekshirish
    if (!csrfTokenElement) {
        console.error("CSRF token topilmadi!");
        return;
    }
    const csrfToken = csrfTokenElement.value;

    if (!name) {
        errorDiv.innerText = "Nomini kiriting!";
        errorDiv.style.display = "block";
        return;
    }

    fetch("/books/category/add/fast/", {
        method: "POST",
        headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "name=" + encodeURIComponent(name)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Tarmoq xatosi yoki Server xatosi');
        }
        return response.json();
    })
    .then(data => {
        if (data.id) {
            // Select ro'yxatiga qo'shish
            const select = document.querySelector('select[name="category"]');
            if (select) {
                const option = new Option(data.name, data.id, true, true);
                select.add(option);
            }

            // Modalni yopish (Xatolikka qarshi tekshiruv bilan)
            const modalElement = document.getElementById('categoryModal');
            if (modalElement && typeof bootstrap !== 'undefined') {
                const modal = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
                modal.hide();
            }

            // Tozalash
            nameInput.value = '';
            errorDiv.style.display = "none";
        } else {
            errorDiv.innerText = data.error || "Xato yuz berdi!";
            errorDiv.style.display = "block";
        }
    })
    .catch(error => {
        console.error('Xatolik:', error);
        errorDiv.innerText = "Server bilan aloqa bog'lanmadi.";
        errorDiv.style.display = "block";
    });
});