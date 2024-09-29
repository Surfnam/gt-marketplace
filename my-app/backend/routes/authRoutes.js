import express from 'express';
import {createUser, signIn, firebaseSignOut} from '../src/firebase.js';
import {authenticate} from '../middleware/authenticateUser.js';

const router = express.Router()

/*router.get('/me', authenticate, (req, res) => {
    console.log("gets user information");
})*/
router.post('/createUser', createUser);
router.post('/signIn', signIn);
router.post('/signOut', firebaseSignOut);

