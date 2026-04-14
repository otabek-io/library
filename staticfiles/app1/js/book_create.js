document.addEventListener('DOMContentLoaded', function () {

    /* ---------- YORDAMCHI FUNKSIYALAR ---------- */
    function formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    }

    function showError(fieldName, message) {
        console.log('Xatolik:', fieldName, message); // Debug uchun

        // data-field atributi bilan konteynerni qidirish
        let container = document.querySelector(`[data-field="${fieldName}"]`);

        // Agar topilmasa, boshqa usullar bilan qidirish
        if (!container) {
            container = document.querySelector(`.file-error[data-field="${fieldName}"]`);
        }
        if (!container) {
            container = document.querySelector(`#${fieldName}Error`);
        }

        if (container) {
            container.textContent = message;
            container.style.display = 'block';
            container.style.color = '#ef4444';
            container.style.fontSize = '13px';
            container.style.marginTop = '6px';
        } else {
            // Konteyner topilmasa, yangi yaratish
            console.warn(`Xatolik konteyneri topilmadi: ${fieldName}`);
            const input = document.querySelector(`[name="${fieldName}"]`);
            if (input) {
                const newError = document.createElement('div');
                newError.className = 'file-error';
                newError.setAttribute('data-field', fieldName);
                newError.style.color = '#ef4444';
                newError.style.fontSize = '13px';
                newError.style.marginTop = '6px';
                newError.textContent = message;
                input.parentNode.appendChild(newError);
            }
            alert(message); // Zaxira sifatida alert chiqarish
        }

        // Input maydonini qizil qilish
        const input = document.querySelector(`[name="${fieldName}"]`);
        if (input) {
            input.classList.add('is-invalid');
            input.style.borderColor = '#ef4444';
        }
    }

    function clearError(fieldName) {
        const container = document.querySelector(`[data-field="${fieldName}"]`);
        if (container) {
            container.textContent = '';
            container.style.display = 'none';
        }
        const input = document.querySelector(`[name="${fieldName}"]`);
        if (input) {
            input.classList.remove('is-invalid');
            input.style.borderColor = '';
        }
    }

    function clearAllErrors() {
        document.querySelectorAll('[data-field]').forEach(el => {
            el.textContent = '';
            el.style.display = 'none';
        });
        document.querySelectorAll('.is-invalid').forEach(el => {
            el.classList.remove('is-invalid');
            el.style.borderColor = '';
        });
    }

    /* ---------- KITOB FAYLI VALIDATSIYASI ---------- */
    const bookFileInput = document.querySelector('#pdfWrapper input[type="file"]');
    const pdfPlaceholder = document.getElementById('pdfPlaceholder');
    const pdfPreview = document.getElementById('pdfPreview');
    const pdfFileName = document.getElementById('pdfFileName');
    const pdfFileSize = document.getElementById('pdfFileSize');
    const pdfRemoveBtn = document.getElementById('pdfRemoveBtn');

    const MAX_BOOK_FILE_SIZE = 100 * 1024 * 1024; // 100MB

    function validateBookFile(file) {
        if (!file) return true;

        console.log('Fayl tekshirilmoqda:', file.name, file.size, file.type);

        const fileName = file.name.toLowerCase();
        const validExtensions = ['.pdf', '.doc', '.docx', '.txt'];
        const hasValidExtension = validExtensions.some(ext => fileName.endsWith(ext));

        if (!hasValidExtension) {
            const msg = `Faqat PDF, DOC, DOCX yoki TXT fayl yuklash mumkin. Siz tanlagan fayl: ${file.name}`;
            showError('book_file', msg);
            return false;
        }

        if (file.size > MAX_BOOK_FILE_SIZE) {
            const msg = `Fayl hajmi 100MB dan oshmasligi kerak. Joriy hajm: ${formatBytes(file.size)}`;
            showError('book_file', msg);
            return false;
        }

        clearError('book_file');
        return true;
    }

    // Kitob fayli yuklash
    if (bookFileInput) {
        console.log('Kitob fayli input topildi');

        bookFileInput.addEventListener('change', function(e) {
            console.log('Fayl tanlandi');
            const file = this.files[0];

            if (!file) {
                console.log('Fayl tanlanmadi');
                return;
            }

            clearError('book_file');

            if (!validateBookFile(file)) {
                this.value = ''; // Faylni tozalash
                if (pdfPreview) pdfPreview.style.display = 'none';
                if (pdfPlaceholder) pdfPlaceholder.style.display = 'block';
                return;
            }

            // Fayl haqida ma'lumot ko'rsatish
            if (pdfFileName) pdfFileName.textContent = file.name;
            if (pdfFileSize) pdfFileSize.textContent = formatBytes(file.size);
            if (pdfPlaceholder) pdfPlaceholder.style.display = 'none';
            if (pdfPreview) pdfPreview.style.display = 'flex';

            console.log('Fayl muvaffaqiyatli yuklandi:', file.name);
        });

        // O'chirish tugmasi
        if (pdfRemoveBtn) {
            pdfRemoveBtn.addEventListener('click', function() {
                bookFileInput.value = '';
                if (pdfPreview) pdfPreview.style.display = 'none';
                if (pdfPlaceholder) pdfPlaceholder.style.display = 'block';
                clearError('book_file');
                console.log('Fayl o\'chirildi');
            });
        }
    } else {
        console.error('Kitob fayli input topilmadi!');
    }

    /* ---------- RASM VALIDATSIYASI ---------- */
    const imageInput = document.querySelector('#imageWrapper input[type="file"]');
    const imagePlaceholder = document.getElementById('imagePlaceholder');
    const imagePreview = document.getElementById('imagePreview');
    const imagePreviewImg = document.getElementById('imagePreviewImg');
    const imageFileName = document.getElementById('imageFileName');
    const imageFileSize = document.getElementById('imageFileSize');
    const imageRemoveBtn = document.getElementById('imageRemoveBtn');

    const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

    function validateImageFile(file) {
        if (!file) return true;

        console.log('Rasm tekshirilmoqda:', file.name, file.size, file.type);

        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            const msg = `Faqat PNG, JPG yoki WEBP formatdagi rasm yuklang. Siz tanlagan fayl: ${file.name}`;
            showError('image', msg);
            return false;
        }

        if (file.size > MAX_IMAGE_SIZE) {
            const msg = `Rasm hajmi 10MB dan oshmasligi kerak. Joriy hajm: ${formatBytes(file.size)}`;
            showError('image', msg);
            return false;
        }

        clearError('image');
        return true;
    }

    if (imageInput) {
        console.log('Rasm input topildi');

        imageInput.addEventListener('change', function() {
            const file = this.files[0];

            if (!file) return;

            clearError('image');

            if (!validateImageFile(file)) {
                this.value = '';
                if (imagePreview) imagePreview.style.display = 'none';
                if (imagePlaceholder) imagePlaceholder.style.display = 'block';
                return;
            }

            const reader = new FileReader();
            reader.onload = function(e) {
                if (imagePreviewImg) imagePreviewImg.src = e.target.result;
                if (imageFileName) imageFileName.textContent = file.name;
                if (imageFileSize) imageFileSize.textContent = formatBytes(file.size);
                if (imagePlaceholder) imagePlaceholder.style.display = 'none';
                if (imagePreview) imagePreview.style.display = 'flex';
                console.log('Rasm muvaffaqiyatli yuklandi');
            };
            reader.readAsDataURL(file);
        });

        if (imageRemoveBtn) {
            imageRemoveBtn.addEventListener('click', function() {
                imageInput.value = '';
                if (imagePreview) imagePreview.style.display = 'none';
                if (imagePlaceholder) imagePlaceholder.style.display = 'block';
                if (imagePreviewImg) imagePreviewImg.src = '';
                clearError('image');
                console.log('Rasm o\'chirildi');
            });
        }
    } else {
        console.error('Rasm input topilmadi!');
    }

    /* ---------- FORMA VALIDATSIYASI ---------- */
    function validateForm() {
        let isValid = true;
        clearAllErrors();

        console.log('Forma tekshirilmoqda...');

        // Majburiy maydonlar
        const requiredFields = [
            { name: 'name', message: 'Kitob nomini kiriting' },
            { name: 'author', message: 'Muallifni kiriting' },
            { name: 'category', message: 'Kategoriyani tanlang' }
        ];

        requiredFields.forEach(field => {
            const input = document.querySelector(`[name="${field.name}"]`);
            if (!input || !input.value.trim()) {
                showError(field.name, field.message);
                isValid = false;
                console.log('Xatolik:', field.name, 'bo\'sh');
            }
        });

        // Manba tekshirish
        const activeSource = document.querySelector('.source-tab-btn.active');
        if (!activeSource) {
            showError('source', 'Manba turini tanlang');
            isValid = false;
            return isValid;
        }

        const source = activeSource.dataset.source;
        console.log('Faol manba:', source);

        if (source === 'pdf') {
            const bookFile = bookFileInput?.files[0];
            if (!bookFile) {
                showError('book_file', 'Kitob fayli yuklanishi shart!');
                isValid = false;
                console.log('Xatolik: Fayl tanlanmagan');
            } else if (!validateBookFile(bookFile)) {
                isValid = false;
                console.log('Xatolik: Fayl validatsiyadan o\'tmadi');
            }
        } else if (source === 'url') {
            const urlInput = document.querySelector('[name="url"]');
            if (!urlInput || !urlInput.value.trim()) {
                showError('url', 'URL manzilini kiriting');
                isValid = false;
                console.log('Xatolik: URL bo\'sh');
            } else {
                try {
                    new URL(urlInput.value);
                    clearError('url');
                } catch (_) {
                    showError('url', 'To\'g\'ri URL kiriting (http:// yoki https:// bilan boshlansin)');
                    isValid = false;
                    console.log('Xatolik: URL noto\'g\'ri formatda');
                }
            }
        }

        console.log('Forma validatsiyasi natijasi:', isValid);
        return isValid;
    }

    /* ---------- INLINE PROGRESS ---------- */
    const progressContainer = document.getElementById('uploadProgressContainer');
    const progressFill = document.getElementById('progressFill');
    const progressPercent = document.getElementById('progressPercent');
    const progressSize = document.getElementById('progressSize');
    const progressStatus = document.getElementById('progressStatus');
    const submitBtn = document.getElementById('submitBtn');
    const bookForm = document.getElementById('bookForm');
    const successToast = document.getElementById('successToast');

    function showProgress() {
        if (progressContainer) {
            progressContainer.style.display = 'block';
        }
        if (progressFill) progressFill.style.width = '0%';
        if (progressPercent) progressPercent.textContent = '0%';
        if (progressSize) progressSize.textContent = '0 KB / 0 KB';
        if (progressStatus) progressStatus.textContent = 'Tayyorlanmoqda...';
    }

    function updateProgress(pct, loaded, total) {
        const clamped = Math.min(100, Math.max(0, pct));
        if (progressFill) progressFill.style.width = clamped + '%';
        if (progressPercent) progressPercent.textContent = Math.round(clamped) + '%';
        if (progressSize) progressSize.textContent = formatBytes(loaded) + ' / ' + formatBytes(total);
        if (progressStatus) {
            progressStatus.textContent = clamped >= 100 ? 'Serverda saqlanmoqda...' : 'Yuklanmoqda...';
        }
    }

    function hideProgress() {
        if (progressContainer) progressContainer.style.display = 'none';
    }

    function showToast() {
        if (successToast) {
            successToast.classList.add('show');
            setTimeout(() => successToast.classList.remove('show'), 4000);
        }
    }

    /* ---------- FORMA YUBORISH ---------- */
    if (bookForm) {
        bookForm.addEventListener('submit', function(e) {
            e.preventDefault();
            console.log('Forma yuborildi');

            if (!validateForm()) {
                console.log('Validatsiya xatosi');
                const firstError = document.querySelector('.is-invalid');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }

            if (submitBtn) submitBtn.disabled = true;
            showProgress();

            const formData = new FormData(bookForm);
            const xhr = new XMLHttpRequest();

            xhr.upload.addEventListener('loadstart', () => {
                console.log('Yuklash boshlandi');
                if (progressStatus) progressStatus.textContent = 'Yuklash boshlandi...';
            });

            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    const pct = (e.loaded / e.total) * 100;
                    updateProgress(pct, e.loaded, e.total);
                    console.log('Progress:', Math.round(pct) + '%');
                }
            });

            xhr.addEventListener('load', function() {
                console.log('Server javobi:', xhr.status);

                if (xhr.status >= 200 && xhr.status < 300) {
                    if (progressStatus) progressStatus.textContent = 'Muvaffaqiyatli saqlandi!';
                    updateProgress(100, 1, 1);
                    showToast();
                    console.log('Muvaffaqiyatli yakunlandi');

                    setTimeout(() => {
                        const cancelBtn = bookForm.querySelector('a.btn-cancel');
                        if (cancelBtn) {
                            window.location.href = cancelBtn.href;
                        }
                    }, 1500);
                } else {
                    let errorMsg = `Server xatosi (${xhr.status})`;
                    try {
                        const resp = JSON.parse(xhr.responseText);
                        if (resp.error) errorMsg = resp.error;
                        if (resp.errors) {
                            Object.keys(resp.errors).forEach(key => {
                                showError(key, resp.errors[key]);
                            });
                        }
                    } catch (e) {
                        console.error('JSON parse xatosi:', e);
                    }

                    if (progressStatus) progressStatus.textContent = 'Xatolik: ' + errorMsg;
                    alert('Xatolik: ' + errorMsg);
                    console.error('Server xatosi:', errorMsg);

                    if (submitBtn) submitBtn.disabled = false;
                    setTimeout(hideProgress, 3000);
                }
            });

            xhr.addEventListener('error', function() {
                console.error('Tarmoq xatosi');
                if (progressStatus) progressStatus.textContent = 'Tarmoq xatosi';
                alert('Tarmoq xatosi. Internet aloqasini tekshiring.');
                if (submitBtn) submitBtn.disabled = false;
                hideProgress();
            });

            xhr.open('POST', bookForm.action || window.location.href);

            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]');
            if (csrfToken) {
                xhr.setRequestHeader('X-CSRFToken', csrfToken.value);
            }

            xhr.send(formData);
            console.log('FormData yuborildi');
        });
    }

    /* ---------- REAL-TIME XATOLIK TOZALASH ---------- */
    document.querySelectorAll('input, select, textarea').forEach(el => {
        el.addEventListener('input', function() {
            this.classList.remove('is-invalid');
            this.style.borderColor = '';
            const fieldName = this.getAttribute('name');
            if (fieldName) clearError(fieldName);
        });

        el.addEventListener('change', function() {
            this.classList.remove('is-invalid');
            this.style.borderColor = '';
            const fieldName = this.getAttribute('name');
            if (fieldName) clearError(fieldName);
        });
    });

    /* ---------- MANBA TANLASH ---------- */
    document.querySelectorAll('.source-tab-btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const source = this.dataset.source;

            document.querySelectorAll('.source-tab-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');

            document.querySelectorAll('.source-content').forEach(c => c.classList.remove('active'));
            document.getElementById(source + 'Content').classList.add('active');

            clearError('book_file');
            clearError('url');
            console.log('Manba o\'zgartirildi:', source);
        });
    });

    /* ---------- KATEGORIYA QO'SHISH ---------- */
    const saveCategoryBtn = document.getElementById('saveCategoryBtn');
    const newCatNameInput = document.getElementById('new_cat_name');
    const catError = document.getElementById('cat_error');
    const categoryModalEl = document.getElementById('categoryModal');

    if (saveCategoryBtn && newCatNameInput) {
        if (categoryModalEl) {
            categoryModalEl.addEventListener('hidden.bs.modal', () => {
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

        saveCategoryBtn.addEventListener('click', function() {
            const name = newCatNameInput.value.trim();
            if (!name) {
                catError.textContent = 'Kategoriya nomini kiriting!';
                catError.style.display = 'block';
                newCatNameInput.style.borderColor = '#ef4444';
                return;
            }

            const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
            saveCategoryBtn.disabled = true;
            saveCategoryBtn.textContent = 'Saqlanmoqda...';

            fetch('/books/category/add/fast/', {
                method: 'POST',
                headers: {
                    'X-CSRFToken': csrfToken,
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: 'name=' + encodeURIComponent(name),
            })
            .then(res => res.json())
            .then(data => {
                if (data.id) {
                    const select = document.querySelector('select[name="category"]');
                    const option = new Option(data.name, data.id, true, true);
                    select.add(option);
                    const modal = bootstrap.Modal.getInstance(categoryModalEl);
                    modal.hide();
                } else {
                    catError.textContent = data.error || 'Xato yuz berdi!';
                    catError.style.display = 'block';
                }
            })
            .catch(err => {
                console.error(err);
                catError.textContent = 'Server bilan bog\'lanib bo\'lmadi.';
                catError.style.display = 'block';
            })
            .finally(() => {
                saveCategoryBtn.disabled = false;
                saveCategoryBtn.textContent = 'Saqlash';
            });
        });
    }

    // Sahifani tepaga scroll qilish
    window.scrollTo({ top: 0, behavior: 'smooth' });

    console.log('JavaScript to\'liq yuklandi');
});