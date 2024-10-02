// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import User from "../backend/models/User";
import {createUser} from "../backend/controllers/userControllers.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyANsfiNvE3nONEvXQig-_sEjUYUAq6QOXY",
  authDomain: "gt-marketplace.firebaseapp.com",
  projectId: "gt-marketplace",
  storageBucket: "gt-marketplace.appspot.com",
  messagingSenderId: "1094493222641",
  appId: "1:1094493222641:web:79bb15d55d4db9d7575b50",
  measurementId: "G-1M27YDGH1T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const auth = getAuth(app);


