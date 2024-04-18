// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-f8f0d.firebaseapp.com",
  projectId: "mern-blog-f8f0d",
  storageBucket: "mern-blog-f8f0d.appspot.com",
  messagingSenderId: "1056244630616",
  appId: "1:1056244630616:web:e70af37acca928766b362d"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);