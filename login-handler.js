import { signInWithEmailAndPassword } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js';
import { auth } from './firebase-config.js';

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('error-message');
            
            try {
                await signInWithEmailAndPassword(auth, email, password);
                window.location.href = 'index.html';
            } catch (error) {
                errorMessage.textContent = 'خطأ في البريد الإلكتروني أو كلمة المرور';
                errorMessage.style.display = 'block';
                console.error('Login error:', error);
            }
        });
    }
});
