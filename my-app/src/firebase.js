// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyANsfiNvE3nONEvXQig-_sEjUYUAq6QOXY",
  authDomain: "gt-marketplace.firebaseapp.com",
  projectId: "gt-marketplace",
  storageBucket: "gt-marketplace.appspot.com",
  messagingSenderId: "1094493222641",
  appId: "1:1094493222641:web:79bb15d55d4db9d7575b50",
  measurementId: "G-1M27YDGH1T"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
