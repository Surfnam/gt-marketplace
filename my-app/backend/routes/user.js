import express from 'express';
import User from '../models/User.js';
import {updateUser, getUserById, addInterestedListing, removeInterestedListing, getUserListings, getUserInterestedListings } from '../controllers/userController.js';

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

// update user related details
router.patch('/:id', updateUser)

// get all user info (except password) by id
router.get('/:id', getUserById)

// GET route to retrieve all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error retrieving users from MongoDB:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// GET route to retrieve all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error retrieving users from MongoDB:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Add an interested listing to a user's interestedListings. Pass in "userId" and "listingId" in post body.
router.post('/interestedListings', addInterestedListing)

// Remove an interested listing from a user's interestedListings. Pass in "userId" and "listingId" in post body.
router.delete('/interestedListings', removeInterestedListing)

// Get all active listings of a user
router.get('/:id/listings', getUserListings);

// Get all interested listings of a user
router.get('/:id/interestedListings', getUserInterestedListings);

export default router;