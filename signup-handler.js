import { createUserWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js';
import { auth } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const errorMessage = document.getElementById('error-message');
            
            if (password !== confirmPassword) {
                errorMessage.textContent = 'كلمتا المرور غير متطابقتين';
                errorMessage.style.display = 'block';
                return;
            }
            
            try {
                await createUserWithEmailAndPassword(auth, email, password);
                window.location.href = 'index.html';
            } catch (error) {
                errorMessage.textContent = 'حدث خطأ أثناء إنشاء الحساب. يرجى المحاولة مرة أخرى.';
                errorMessage.style.display = 'block';
                console.error('Signup error:', error);
            }
        });
    }
});
