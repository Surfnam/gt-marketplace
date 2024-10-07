import express from 'express';
import User from '../models/User.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  const { uid, email } = req.body;

  try {
    const newUser = new User({
      username: email,
      password: uid, // Assuming you want to store the uid as password, otherwise hash the password
      fullName: '', // Add fullName if available
    });

    await newUser.save();
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error saving user to MongoDB:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;