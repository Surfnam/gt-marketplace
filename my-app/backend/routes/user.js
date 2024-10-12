import express from 'express'
import { updateProfilePicture } from '../controllers/userController.js';

const router = express.Router();

// update profile picture
router.patch('/:id/profilePicture', updateProfilePicture) //id specifies the user id 


export default router;