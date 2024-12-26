// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyAAWKabJxK5wmMjCF4kOTHJ_baXVu1GQ8Y",
    authDomain: "jindo-vetai.firebaseapp.com",
    projectId: "jindo-vetai",
    storageBucket: "jindo-vetai.firebasestorage.app",
    messagingSenderId: "25985699047",
    appId: "1:25985699047:web:ecb596738d891912c42642",
    measurementId: "G-1SQF2R8GM0"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const authentication = getAuth(app);


