// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDSFvZz3qj3rcOdnMY7lV10icnSUiUvI2s",
  authDomain: "bscene-82ff5.firebaseapp.com",
  projectId: "bscene-82ff5",
  storageBucket: "bscene-82ff5.appspot.com",
  messagingSenderId: "894196168603",
  appId: "1:894196168603:web:5009274e89c1ed08bad33e",
  measurementId: "G-1SKV31KQVY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);