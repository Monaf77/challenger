// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBjjYz3-12s-ELfdo4zEPr2G1Ba7Oj_7Uo",
  authDomain: "monaf-7559c.firebaseapp.com",
  projectId: "monaf-7559c",
  storageBucket: "monaf-7559c.firebasestorage.app",
  messagingSenderId: "171045970268",
  appId: "1:171045970268:web:6e04f97c0cfa744bd6a199",
  measurementId: "G-XBN257M6Z4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const analytics = getAnalytics(app);

export { auth };
