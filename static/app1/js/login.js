// JavaScript - Password toggle and autocomplete fix
document.addEventListener('DOMContentLoaded', function() {
    // Password toggle functionality
    document.querySelectorAll('.password-toggle').forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.parentElement.querySelector('.password-input');
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            this.textContent = type === 'password' ? '👁' : '🔒';
        });
    });

    // Fix for autofilled inputs on page load
    setTimeout(() => {
        document.querySelectorAll('.input').forEach(input => {
            if (input.value) {
                input.classList.add('filled');
                const label = input.nextElementSibling;
                if (label && label.classList.contains('floating-label')) {
                    label.style.top = '-10px';
                    label.style.fontSize = '13px';
                    label.style.color = '#4a6cf7';
                    label.style.backgroundColor = '#fff';
                    label.style.padding = '0 6px';
                    label.style.zIndex = '2';
                }
            }
        });
    }, 100);

    // Real-time password match check
    const password1 = document.getElementById('password1');
    const password2 = document.getElementById('password2');
    const passwordError = document.getElementById('passwordError');

    if (password1 && password2) {
        function checkPasswordMatch() {
            if (password2.value && password1.value !== password2.value) {
                passwordError.style.display = 'flex';
                password2.classList.add('error');
            } else {
                passwordError.style.display = 'none';
                password2.classList.remove('error');
            }
        }

        password1.addEventListener('input', checkPasswordMatch);
        password2.addEventListener('input', checkPasswordMatch);
    }
});
