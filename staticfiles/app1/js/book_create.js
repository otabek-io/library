document.addEventListener('DOMContentLoaded', function () {

    /* ─────────────────────────────────────────────
       HELPERS
    ───────────────────────────────────────────── */
    function formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    /* ─────────────────────────────────────────────
       UPLOAD OVERLAY ELEMENTS
    ───────────────────────────────────────────── */
    const overlay      = document.getElementById('uploadOverlay');
    const progressFill = document.getElementById('progressFill');
    const progressPct  = document.getElementById('progressPercent');
    const progressSize = document.getElementById('progressSize');
    const uploadTitle  = document.getElementById('uploadTitle');
    const uploadSub    = document.getElementById('uploadSubtitle');
    const step1        = document.getElementById('step1');
    const step2        = document.getElementById('step2');
    const step3        = document.getElementById('step3');
    const closeOverlayBtn = document.getElementById('closeOverlayBtn');
    const successToast = document.getElementById('successToast');

    function showOverlay() {
        overlay.classList.add('active');
        setStep(1);
        setProgress(0, 0, 0);
        uploadTitle.textContent = 'Yuklanmoqda...';
        uploadSub.textContent   = 'Iltimos, kuting';
        closeOverlayBtn.style.display = 'none';
    }

    function hideOverlay() {
        overlay.classList.remove('active');
    }

    function setProgress(pct, loaded, total) {
        const clamped = Math.min(100, Math.max(0, pct));
        progressFill.style.width  = clamped + '%';
        progressPct.textContent   = Math.round(clamped) + '%';
        progressSize.textContent  = formatBytes(loaded) + ' / ' + formatBytes(total);
    }

    function setStep(n) {
        [step1, step2, step3].forEach((s, i) => {
            s.classList.remove('active', 'done');
            if (i + 1 < n)  s.classList.add('done');
            if (i + 1 === n) s.classList.add('active');
        });
    }

    function setAllStepsDone() {
        [step1, step2, step3].forEach(step => {
            step.classList.remove('active');
            step.classList.add('done');
        });
    }

    function showSuccessToast() {
        successToast.classList.add('show');
        setTimeout(() => successToast.classList.remove('show'), 3500);
    }

    if (closeOverlayBtn) {
        closeOverlayBtn.addEventListener('click', function() {
            hideOverlay();
            // Agar xohlasangiz, sahifani yangilash yoki kitoblar ro'yxatiga o'tish mumkin
            // window.location.href = "{% url 'book-list' %}";
        });
    }

    /* ─────────────────────────────────────────────
       IMAGE PREVIEW
    ───────────────────────────────────────────── */
    const imageInput    = document.querySelector('#imageWrapper input[type="file"]');
    const imagePlaceholder = document.getElementById('imagePlaceholder');
    const imagePreview  = document.getElementById('imagePreview');
    const imagePreviewImg = document.getElementById('imagePreviewImg');
    const imageFileName = document.getElementById('imageFileName');
    const imageFileSize = document.getElementById('imageFileSize');
    const imageRemoveBtn = document.getElementById('imageRemoveBtn');

    if (imageInput) {
        imageInput.addEventListener('change', function () {
            const file = this.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = function (e) {
                imagePreviewImg.src = e.target.result;
                imageFileName.textContent = file.name;
                imageFileSize.textContent = formatBytes(file.size);
                imagePlaceholder.style.display = 'none';
                imagePreview.style.display = 'flex';
            };
            reader.readAsDataURL(file);
        });

        imageRemoveBtn.addEventListener('click', function () {
            imageInput.value = '';
            imagePreview.style.display = 'none';
            imagePlaceholder.style.display = 'block';
            imagePreviewImg.src = '';
        });
    }

    /* ─────────────────────────────────────────────
       PDF PREVIEW
    ───────────────────────────────────────────── */
    const pdfInput      = document.querySelector('#pdfWrapper input[type="file"]');
    const pdfPlaceholder = document.getElementById('pdfPlaceholder');
    const pdfPreview    = document.getElementById('pdfPreview');
    const pdfFileName   = document.getElementById('pdfFileName');
    const pdfFileSize   = document.getElementById('pdfFileSize');
    const pdfRemoveBtn  = document.getElementById('pdfRemoveBtn');

    if (pdfInput) {
        pdfInput.addEventListener('change', function () {
            const file = this.files[0];
            if (!file) return;

            pdfFileName.textContent = file.name;
            pdfFileSize.textContent = formatBytes(file.size);
            pdfPlaceholder.style.display = 'none';
            pdfPreview.style.display = 'flex';
        });

        pdfRemoveBtn.addEventListener('click', function () {
            pdfInput.value = '';
            pdfPreview.style.display = 'none';
            pdfPlaceholder.style.display = 'block';
        });
    }

    /* ─────────────────────────────────────────────
       FORM SUBMIT — XMLHttpRequest bilan progress
    ───────────────────────────────────────────── */
    const bookForm  = document.getElementById('bookForm');
    const submitBtn = document.getElementById('submitBtn');

    if (bookForm) {
        bookForm.addEventListener('submit', function (e) {
            e.preventDefault();

            // Majburiy maydonlarni tekshirish
            const requiredFields = bookForm.querySelectorAll('[required]');
            let isValid = true;
            requiredFields.forEach(field => {
                field.style.borderColor = field.value.trim() ? '#e2e8f0' : '#ef4444';
                if (!field.value.trim()) isValid = false;
            });

            if (!isValid) {
                alert("Iltimos, barcha majburiy maydonlarni to'ldiring!");
                return;
            }

            showOverlay();
            submitBtn.disabled = true;

            const formData = new FormData(bookForm);
            const xhr = new XMLHttpRequest();

            setStep(1);
            uploadTitle.textContent = 'Fayl tayyorlanmoqda...';
            uploadSub.textContent   = 'Maʼlumotlar yigʻilmoqda';

            xhr.upload.addEventListener('loadstart', function () {
                setTimeout(() => {
                    setStep(2);
                    uploadTitle.textContent = 'Server ga yuborilmoqda...';
                    uploadSub.textContent   = 'Fayl yuklanmoqda, iltimos kuting';
                }, 400);
            });

            xhr.upload.addEventListener('progress', function (e) {
                if (e.lengthComputable) {
                    const pct = (e.loaded / e.total) * 100;
                    setProgress(pct, e.loaded, e.total);
                }
            });

            xhr.upload.addEventListener('load', function () {
                setProgress(100, 1, 1);
                setStep(3);
                uploadTitle.textContent = 'Saqlanyapti...';
                uploadSub.textContent   = 'Server javob kutilmoqda';
            });

            xhr.addEventListener('load', function () {
                if (xhr.status >= 200 && xhr.status < 400) {
                    // Muvaffaqiyatli yakun
                    setAllStepsDone();
                    uploadTitle.textContent = '✅ Yuklandi!';
                    uploadSub.textContent   = 'Fayl muvaffaqiyatli yuklandi.';
                    setProgress(100, 1, 1);
                    closeOverlayBtn.style.display = 'block';
                    showSuccessToast();
                    submitBtn.disabled = false;
                    // Agar xohlasangiz, yopish tugmasi bosilganda avtomatik yo'naltirish qo'shishingiz mumkin
                    // closeOverlayBtn.onclick = () => { window.location.href = "{% url 'book-list' %}"; };
                } else {
                    hideOverlay();
                    submitBtn.disabled = false;
                    handleError('Server xatosi (' + xhr.status + '). Qaytadan urinib koʻring.');
                }
            });

            xhr.addEventListener('error', function () {
                hideOverlay();
                submitBtn.disabled = false;
                handleError('Tarmoq xatosi yuz berdi. Internet aloqasini tekshiring.');
            });

            xhr.addEventListener('abort', function () {
                hideOverlay();
                submitBtn.disabled = false;
            });

            xhr.open('POST', bookForm.action || window.location.href, true);

            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]');
            if (csrfToken) {
                xhr.setRequestHeader('X-CSRFToken', csrfToken.value);
            }

            setTimeout(() => xhr.send(formData), 300);
        });
    }

    function handleError(msg) {
        alert(msg);
        [step1, step2, step3].forEach(s => s.classList.remove('active', 'done'));
        closeOverlayBtn.style.display = 'none';
    }

    /* ─────────────────────────────────────────────
       LABEL FOCUS EFFECT
    ───────────────────────────────────────────── */
    document.querySelectorAll('.form-control, .form-select, textarea').forEach(input => {
        const label = input.closest('.form-group-custom')?.querySelector('.form-label');
        if (!label) return;
        input.addEventListener('focus', () => label.style.color = '#667eea');
        input.addEventListener('blur',  () => label.style.color = '#2d3748');
    });

    /* ─────────────────────────────────────────────
       KATEGORIYA QO'SHISH — Modal + AJAX
    ───────────────────────────────────────────── */
    const saveCategoryBtn = document.getElementById('saveCategoryBtn');
    const newCatNameInput = document.getElementById('new_cat_name');
    const catError        = document.getElementById('cat_error');

    if (saveCategoryBtn && newCatNameInput) {
        const categoryModal = document.getElementById('categoryModal');
        if (categoryModal) {
            categoryModal.addEventListener('hidden.bs.modal', () => {
                newCatNameInput.value = '';
                catError.style.display = 'none';
            });
        }

        newCatNameInput.addEventListener('input', () => {
            catError.style.display = 'none';
            newCatNameInput.style.borderColor = '#e2e8f0';
        });

        newCatNameInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') saveCategoryBtn.click();
        });

        saveCategoryBtn.addEventListener('click', function () {
            const name = newCatNameInput.value.trim();

            if (!name) {
                catError.textContent = 'Kategoriya nomini kiriting!';
                catError.style.display = 'block';
                newCatNameInput.style.borderColor = '#ef4444';
                return;
            }

            const csrfTokenEl = document.querySelector('[name=csrfmiddlewaretoken]');
            if (!csrfTokenEl) {
                catError.textContent = 'CSRF token topilmadi!';
                catError.style.display = 'block';
                return;
            }

            saveCategoryBtn.disabled = true;
            saveCategoryBtn.textContent = 'Saqlanmoqda...';

            fetch('/books/category/add/fast/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfTokenEl.value,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'name=' + encodeURIComponent(name),
            })
            .then(res => {
                if (!res.ok) throw new Error('Server xatosi: ' + res.status);
                return res.json();
            })
            .then(data => {
                if (data.id) {
                    const select = document.querySelector('select[name="category"]');
                    if (select) {
                        const option = new Option(data.name, data.id, true, true);
                        select.add(option);
                    }
                    const modal   = bootstrap.Modal.getInstance(categoryModal) || new bootstrap.Modal(categoryModal);
                    modal.hide();
                } else {
                    catError.textContent   = data.error || 'Xato yuz berdi!';
                    catError.style.display = 'block';
                }
            })
            .catch(err => {
                console.error('Kategoriya xatosi:', err);
                catError.textContent   = 'Server bilan aloqa oʻrnatilmadi.';
                catError.style.display = 'block';
            })
            .finally(() => {
                saveCategoryBtn.disabled    = false;
                saveCategoryBtn.textContent = 'Saqlash';
            });
        });
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
});