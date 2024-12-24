// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
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
  appId: "1:25985699047:web:ce074289058b2800c42642",
  measurementId: "G-KVX4J0ZL5D"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const authentication = getAuth(app);


