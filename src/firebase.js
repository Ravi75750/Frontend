// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC_9ZyfMMPtCD76JmQ72WgCUKGAUNojM_Y",
    authDomain: "fireleague-d0d01.firebaseapp.com",
    projectId: "fireleague-d0d01",
    storageBucket: "fireleague-d0d01.firebasestorage.app",
    messagingSenderId: "447332197630",
    appId: "1:447332197630:web:2a9e09cc8a24ca6b9f71af",
    measurementId: "G-DQ66C67KYG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);

// Initialize Auth
export const auth = getAuth(app);
export default app;
