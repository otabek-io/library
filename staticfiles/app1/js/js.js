document.getElementById('saveCategoryBtn').addEventListener('click', function() {
    const name = document.getElementById('new_cat_name').value;
    const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
    const errorDiv = document.getElementById('cat_error');

    if (!name) {
        errorDiv.innerText = "Nomini kiriting!";
        errorDiv.style.display = "block";
        return;
    }

    fetch("{% url 'fast_category_add' %}", {
        method: "POST",
        headers: {
            "X-CSRFToken": csrfToken,
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: "name=" + encodeURIComponent(name)
    })
    .then(response => response.json())
    .then(data => {
        if (data.id) {
            // 1. Yangi kategoriyani Select ro'yxatiga qo'shish
            const select = document.querySelector('select[name="category"]');
            const option = new Option(data.name, data.id, true, true);
            select.add(option);

            // 2. Modalni yopish
            const modalElement = document.getElementById('categoryModal');
            const modal = bootstrap.Modal.getInstance(modalElement);
            modal.hide();

            // 3. Inputni tozalash
            document.getElementById('new_cat_name').value = '';
            errorDiv.style.display = "none";
        } else {
            errorDiv.innerText = "Xato yuz berdi!";
            errorDiv.style.display = "block";
        }
    });
});