document.addEventListener('DOMContentLoaded', function() {
    // File upload preview functionality
    const imageInput = document.querySelector('input[type="file"][accept*="image"]');
    const pdfInput = document.querySelector('input[type="file"][accept*="pdf"]');

    if (imageInput) {
        imageInput.addEventListener('change', function(e) {
            const fileName = e.target.files[0]?.name;
            const placeholder = e.target.closest('.file-upload-wrapper').querySelector('.file-upload-placeholder p');
            if (fileName) {
                placeholder.textContent = fileName;
                placeholder.style.color = '#10b981';
                placeholder.style.fontWeight = '600';
            }
        });
    }

    if (pdfInput) {
        pdfInput.addEventListener('change', function(e) {
            const fileName = e.target.files[0]?.name;
            const placeholder = e.target.closest('.file-upload-wrapper').querySelector('.file-upload-placeholder p');
            if (fileName) {
                placeholder.textContent = fileName;
                placeholder.style.color = '#10b981';
                placeholder.style.fontWeight = '600';
            }
        });
    }

    // Form validation
    const bookForm = document.getElementById('bookForm');
    if (bookForm) {
        bookForm.addEventListener('submit', function(e) {
            const requiredFields = bookForm.querySelectorAll('[required]');
            let isValid = true;

            requiredFields.forEach(field => {
                if (!field.value.trim()) {
                    isValid = false;
                    field.style.borderColor = '#ef4444';
                } else {
                    field.style.borderColor = '#e2e8f0';
                }
            });

            if (!isValid) {
                e.preventDefault();
                alert("Iltimos, barcha majburiy maydonlarni to'ldiring!");
            }
        });
    }

    // Category modal functionality
    const saveCategoryBtn = document.getElementById('saveCategoryBtn');
    const newCatNameInput = document.getElementById('new_cat_name');
    const catError = document.getElementById('cat_error');

    if (saveCategoryBtn && newCatNameInput) {
        saveCategoryBtn.addEventListener('click', function() {
            const categoryName = newCatNameInput.value.trim();

            if (!categoryName) {
                catError.textContent = 'Kategoriya nomini kiriting!';
                catError.style.display = 'block';
                return;
            }

            // Here you would typically make an AJAX call to save the category
            // For now, we'll just close the modal
            catError.style.display = 'none';

            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('categoryModal'));
            if (modal) {
                modal.hide();
            }

            // Reset input
            newCatNameInput.value = '';

            // Show success message
            alert('Kategoriya muvaffaqiyatli qo\'shildi!');
        });

        // Clear error on input
        newCatNameInput.addEventListener('input', function() {
            catError.style.display = 'none';
        });
    }

    // Smooth scroll to form on page load
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Add floating label effect
    const formInputs = document.querySelectorAll('.form-control, .form-select, textarea');
    formInputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.querySelector('.form-label')?.style.setProperty('color', '#667eea');
        });

        input.addEventListener('blur', function() {
            this.parentElement.querySelector('.form-label')?.style.setProperty('color', '#2d3748');
        });
    });
});

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