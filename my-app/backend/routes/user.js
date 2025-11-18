import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt'
import {updateUser, updateInterestedListings, getUserById, getUserByIdPaginated, getUserByEmail, addInterestedListing, removeInterestedListing, getUserListings, getUserInterestedListings, addContact, getUserInactiveListings, addInactiveListing, removeInactiveListing, removeActiveListing, addActiveListing, searchUsers } from '../controllers/userController.js';

const router = express.Router();

// check suspension when user makes a request
const checkSuspension = async(req, res, next) => {
  try {
    const userId = req.body.userId;
    if (!userId) {
      return res.status(400).json({ error: 'User ID is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    if (user.isSuspended) {
      return res.status(403).json({ error: 'User is suspended' }); /*Reason: ${user.suspensionReason}*/
    }
    next();
  } catch (error) {
    console.error('Error checking user suspension status:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


router.post('/register', async (req, res) => {
  const { uid, email } = req.body;

  let existingUser = await User.findOne({ username: uid });
  if (existingUser) {
    return res.status(200).json({
      message: "User already exists",
      userId: existingUser._id,
      isNewUser: false,
    });
  }
  
  try {
    const pw = await bcrypt.hash(uid, 10)
    const newUser = new User({
      username: uid,
      password: pw,
      email: email, // Assuming you want to store the uid as password, otherwise hash the password
      fullName: '', // Add fullName if available
    });

    const user = await newUser.save();

    res.status(201).json({ 
      message: 'User registered successfully', 
      userId: user._id,
      isNewUser: true,
    });
  } catch (error) {
    console.error('Error saving user to MongoDB:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// update user related details
router.patch('/:id', checkSuspension, updateUser);
router.patch('/:id/interestedListings', checkSuspension, updateInterestedListings);

router.get('/profile/:email', getUserByEmail)

// search users
router.get('/search', searchUsers)

// get all user info (except password) by id
router.get('/:id', getUserById)

// get all user info with paginated listings
router.get('/:id/paginated', getUserByIdPaginated);

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

// Suspends user (put or patch)
router.patch('/:id/suspend', async (req, res) => {
  //const {reason} = req.body; // if we want to reason
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { isSuspended: true /*, suspensionReason: reason */}, 
      { new: true });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ message: 'User suspended successfully', user }); 
    } catch (error) {
      console.error('Error suspending user in MongoDB:', error);
      res.status(500).json({ error: 'Internal Server Error' }); 
    }
});

// for testing
/* router.patch('/:id/admin', async (req, res) => {
  //const {reason} = req.body; // if we want to reason
  try {
    const user = await User.findByIdAndUpdate(
      req.params.id, 
      { role: "admin" }, 
      { new: true });
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ message: 'User suspended successfully', user }); 
    } catch (error) {
      console.error('Error suspending user in MongoDB:', error);
      res.status(500).json({ error: 'Internal Server Error' }); 
    }
}); */


// Add an interested listing to a user's interestedListings. Pass in "userId" and "listingId" in post body.
router.post('/interestedListings', checkSuspension, addInterestedListing)

// Remove an interested listing from a user's interestedListings. Pass in "userId" and "listingId" in post body.
router.delete('/interestedListings', checkSuspension, removeInterestedListing)

// Add an inactive listing to a user's inactiveListings. Pass in "userId" and "listingId" in post body.
router.post('/inactiveListings', checkSuspension, addInactiveListing)

// Remove an inactive listing from a user's inactiveListings. Pass in "userId" and "listingId" in post body.
router.delete('/inactiveListings', checkSuspension, removeInactiveListing)

// Add an active listing to a user's listings. Pass in "userId" and "listingId" in post body.
router.post('/activeListings', checkSuspension, addActiveListing)

// Remove an active listing from a user's listings. Pass in "userId" and "listingId" in post body.
router.delete('/activeListings', checkSuspension, removeActiveListing);

// Get all active listings of a user
router.get('/:id/listings', getUserListings);

// Get all interested listings of a user
router.get('/:id/interestedListings', getUserInterestedListings);

// Get all inactive listings of a user
router.get('/:id/inactiveListings', getUserInactiveListings);

// add new contact
router.post('/addContact', checkSuspension, addContact)



export default router;