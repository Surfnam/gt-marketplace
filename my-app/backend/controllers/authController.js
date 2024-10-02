// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import User from "../models/User.js";
import {createUser} from "./userController.js";

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

export const createFirebaseUser = async (req, res) => {
    const {email, password, fullName, username} = req.body;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        //add uesr to mongoDB
        const mongoUser = await createUser({username, password, fullName, email});

        res.status(201).json({firebaseUser: user, mongo: mongoUser});

    } catch (err) {
        res.status(500).json({error: err.message});
    }
    

}



export const signIn = async (req, res) => {
  const {email, password, fullName, username} = req.body;
  try {
    if (req.session.authenticated) {
        return res.status(401).json({message: "already signed in"});
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password)
  
    // Signed in 
    const user = userCredential.user;
    // ...
    req.session.authenticated = true;
    //query mongodb for user
    const mongoUser = await User.findOne({email: email});

    if (!mongoUser) {
        return res.status(404).json({message: "User not found"});
    }
    
    req.session.user = mongoUser;
    req.session.userId = mongoUser._id;
    return res.status(201).json({mongouser: mongoUser, session: req.session});
  } catch(error)  {
    res.status(401).json({error: error.message});
  }
}


export const firebaseSignOut = async (req, res) => {
    //await signOut(auth);
    if (!req.session || !req.session.authenticated) {
        return res.status(401).json({message: "not signed in"});
    }

    signOut(auth).then(() => {
    // Sign-out successful.
    req.session.authenticated = false;
    req.session.user = null;
    req.session.userId = null;
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.status(500).json({message: 'Error destroying session'});
        } else {
            res.clearCookie('connect.sid', { path: '/' }); //  I dont know hwy but this doesnt seem to work.
            return res.status(200).json({ message: 'Session destroyed and cookie cleared' });
        //res.redirect('/'); // Redirect to home page
        }
    });
    //console.log(req.session)

    //res.status(200).json({message: "signed out"});
    }).catch((error) => {
        res.status(500).json({error: error.message});
    });
}

