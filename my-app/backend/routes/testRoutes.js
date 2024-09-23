import express from 'express'
import {addUser, addListing, deleteUsersandListings, updateUser, updateListing} from '../controllers/testAPI.controllers.js'
import { getListingByCategory, getListingByPrice } from '../controllers/listingController.js';

const router = express.Router();

// add new user
router.post('/addUser', addUser)
// add new Listing
router.post('/addListing/:id', addListing) //id specifies the user id

router.delete('/delete', deleteUsersandListings) // either delete all or delete a specific listing
                                                 // or user by specifying the id fields in the req.body           
router.put('/updateUser/:id', updateUser)
router.put('/updateListing/:id', updateListing)

router.get('/category/:category', getListingByCategory)
router.get('/price', getListingByPrice)

export default router;

