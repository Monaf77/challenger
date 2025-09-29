import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js';
import { auth } from './firebase-config.js';

// Check auth state
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in
        document.getElementById('userInfo').style.display = 'block';
        document.getElementById('guestInfo').style.display = 'none';
        document.getElementById('userName').textContent = user.email;
    } else {
        // User is signed out
        document.getElementById('userInfo').style.display = 'none';
        document.getElementById('guestInfo').style.display = 'block';
    }
});

// Sign out function
const signOutBtn = document.getElementById('signOutBtn');
if (signOutBtn) {
    signOutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
            window.location.href = 'index.html';
        } catch (error) {
            console.error('Error signing out:', error);
        }
    });
}
