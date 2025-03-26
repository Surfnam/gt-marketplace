// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FBAPIKEY,
  authDomain: process.env.REACT_APP_FBAUTHDOMAIN,
  projectId: process.env.REACT_APP_FBPROJECT_ID,
  storageBucket: process.env.REACT_APP_FBSTORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FBMESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FBAPP_ID ,
  measurementId: process.env.REACT_APP_FBMEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
