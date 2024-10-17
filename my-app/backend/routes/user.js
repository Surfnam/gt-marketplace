import express from 'express';
import User from '../models/User.js';
import { updateProfilePicture } from '../controllers/userController.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { uid, email } = req.body;

  try {
    const newUser = new User({
      username: email + 'hello',
      password: uid, // Assuming you want to store the uid as password, otherwise hash the password
      fullName: 'test', // Add fullName if available
      email,
    });

    const mongoUser = await newUser.save();

    // req.session.authenticated = true;
    // req.session.userId = mongoUser._id;

    console.log("user registered");

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error saving user to MongoDB:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// update profile picture
router.patch('/:id/profilePicture', updateProfilePicture) //id specifies the user id 

export default router;