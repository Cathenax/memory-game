import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBZKZHTDEVVTNyOMZmkOLm_3cL7WUi4Fz8",
  authDomain: "memorygame-88e52.firebaseapp.com",
  projectId: "memorygame-88e52",
  storageBucket: "memorygame-88e52.appspot.com",
  messagingSenderId: "1012678189579",
  appId: "1:1012678189579:web:af10a73429b1d403ca5d0e",
  measurementId: "G-D7WJWT0G2K"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
console.log('Firebase initiallized!', app, analytics);
