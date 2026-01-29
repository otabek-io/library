document.addEventListener('DOMContentLoaded', function() {
    // Favorite button functionality
    const favoriteBtn = document.getElementById('add-to-favorites');
    if (favoriteBtn) {
        favoriteBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const isActive = icon.classList.contains('fas');

            if (isActive) {
                icon.classList.remove('fas');
                icon.classList.add('far');
            } else {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.style.animation = 'likePop 0.3s ease';

                setTimeout(() => {
                    this.style.animation = '';
                }, 300);
            }
        });
    }

    // Share button functionality
    const shareBtn = document.getElementById('share-book');
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            const bookTitle = document.querySelector('.book-title').textContent;
            const shareText = `${bookTitle}\nKitobni o'qib chiqing!`;

            if (navigator.share) {
                navigator.share({
                    title: bookTitle,
                    text: shareText,
                    url: window.location.href
                }).catch(err => console.log('Ulashishda xatolik:', err));
            } else {
                navigator.clipboard.writeText(window.location.href)
                    .catch(err => console.log('Nusxalashda xatolik:', err));
            }
        });
    }

    // Rate button functionality
    const rateBtn = document.getElementById('rate-book');
    if (rateBtn) {
        rateBtn.addEventListener('click', function() {
            const rating = prompt('Kitobni 1-5 yulduz oralig\'ida baholang:', '5');
            // Hech qanday notification yo'q
        });
    }

    // Auto-expanding textarea (YouTube style)
    const commentTextarea = document.querySelector('.comment-textarea');
    const charCounter = document.querySelector('#char-counter');

    if (commentTextarea) {
        // Auto-expand functionality
        commentTextarea.addEventListener('input', function() {
            this.style.height = 'auto';
            this.style.height = (this.scrollHeight) + 'px';

            // Character counter
            if (charCounter) {
                const length = this.value.length;
                charCounter.textContent = length;

                if (length > 900) {
                    charCounter.style.color = '#e74c3c';
                } else if (length > 500) {
                    charCounter.style.color = '#f39c12';
                } else {
                    charCounter.style.color = '#95a5a6';
                }
            }
        });

        // Initial character count
        if (charCounter) {
            charCounter.textContent = commentTextarea.value.length;
        }

        // Trigger initial height calculation
        setTimeout(() => {
            commentTextarea.style.height = 'auto';
            commentTextarea.style.height = (commentTextarea.scrollHeight) + 'px';
        }, 100);
    }

    // Comment form submission
    const commentForm = document.querySelector('.comment-form');
    const submitBtn = document.querySelector('.comment-submit-btn');

    if (commentForm && submitBtn) {
        commentForm.addEventListener('submit', function(e) {
            const textarea = this.querySelector('.comment-textarea');
            if (textarea && textarea.value.trim().length < 5) {
                e.preventDefault();
                textarea.style.borderColor = '#e74c3c';
                setTimeout(() => {
                    textarea.style.borderColor = '';
                }, 2000);
                return false;
            }

            // Show loading state
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Yuborilmoqda...';
        });
    }

    // Like button functionality
    document.querySelectorAll('.like-btn').forEach(button => {
        button.addEventListener('click', function() {
            const isLiked = this.classList.contains('liked');
            const likeCount = this.querySelector('.like-count');
            let count = parseInt(likeCount.textContent) || 0;

            if (isLiked) {
                this.classList.remove('liked');
                count--;
                this.querySelector('i').classList.remove('fas');
                this.querySelector('i').classList.add('far');
            } else {
                this.classList.add('liked');
                count++;
                this.querySelector('i').classList.remove('far');
                this.querySelector('i').classList.add('fas');
                this.style.animation = 'likePop 0.3s ease';

                setTimeout(() => {
                    this.style.animation = '';
                }, 300);
            }

            likeCount.textContent = count;
        });
    });

    // Reply button functionality
    document.querySelectorAll('.reply-btn').forEach(button => {
        button.addEventListener('click', function() {
            const commentCard = this.closest('.comment-card');

            // Remove existing reply form
            const existingForm = document.querySelector('.reply-form');
            if (existingForm) {
                existingForm.remove();
            }

            // Add new reply form
            const replyForm = document.createElement('div');
            replyForm.className = 'reply-form';
            replyForm.innerHTML = `
                <div class="form-group">
                    <textarea class="comment-textarea" placeholder="Javobingizni yozing..." rows="2"></textarea>
                    <div class="reply-actions">
                        <button class="comment-submit-btn send-reply" style="margin-top: 5px;">Javob yuborish</button>
                        <button class="action-btn cancel-reply" style="background: none; border: none; color: #95a5a6;">Bekor qilish</button>
                    </div>
                </div>
            `;

            commentCard.parentNode.insertBefore(replyForm, commentCard.nextSibling);

            // Focus on textarea and add auto-expand
            const replyTextarea = replyForm.querySelector('.comment-textarea');
            replyTextarea.focus();
            replyTextarea.addEventListener('input', function() {
                this.style.height = 'auto';
                this.style.height = (this.scrollHeight) + 'px';
            });

            // Add event listeners for reply actions
            replyForm.querySelector('.send-reply').addEventListener('click', function() {
                const replyText = replyForm.querySelector('textarea').value;
                if (replyText.trim()) {
                    replyForm.remove();
                }
            });

            replyForm.querySelector('.cancel-reply').addEventListener('click', function() {
                replyForm.remove();
            });
        });
    });

    // Delete button functionality
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', function() {
            if (confirm('Haqiqatan ham bu sharhni o\'chirmoqchimisiz?')) {
                const commentCard = this.closest('.comment-card');
                commentCard.style.opacity = '0.5';
                commentCard.style.transform = 'translateX(20px)';

                setTimeout(() => {
                    commentCard.remove();
                    updateCommentsCount();
                }, 300);
            }
        });
    });

    // Sort comments functionality
    const sortSelect = document.getElementById('sort-comments');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const commentsContainer = document.querySelector('.comments-list-container');
            const comments = Array.from(commentsContainer.querySelectorAll('.comment-card'));

            if (this.value === 'newest') {
                comments.sort((a, b) => {
                    const dateA = new Date(a.querySelector('.comment-date').textContent);
                    const dateB = new Date(b.querySelector('.comment-date').textContent);
                    return dateB - dateA;
                });
            } else if (this.value === 'oldest') {
                comments.sort((a, b) => {
                    const dateA = new Date(a.querySelector('.comment-date').textContent);
                    const dateB = new Date(b.querySelector('.comment-date').textContent);
                    return dateA - dateB;
                });
            }

            // Reorder comments
            commentsContainer.innerHTML = '';
            comments.forEach(comment => commentsContainer.appendChild(comment));
        });
    }

    // Load more comments
    const loadMoreBtn = document.getElementById('load-more-comments');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            this.disabled = true;
            this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Yuklanmoqda...';

            // Simulate loading
            setTimeout(() => {
                this.style.display = 'none';
            }, 1500);
        });
    }

    // Update comments count
    function updateCommentsCount() {
        const countElement = document.querySelector('.comments-count');
        if (countElement) {
            const comments = document.querySelectorAll('.comment-card').length;
            countElement.textContent = `${comments} ta sharh`;
        }
    }
});