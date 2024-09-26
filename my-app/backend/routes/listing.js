import express from 'express'
import { addListing, getListingById, getListingByCategory, getListingByPrice } from '../controllers/listingController.js'

const router = express.Router();

// add new Listing
router.post('/:id', addListing) //id specifies the user id 

// get a specific listing based on its id
router.get('/:id', getListingById)

// Get a specific listing based on its category
// http://localhost:3000/listing/category/categoryName
router.get('/category/:category', getListingByCategory)

// Get a specific listing based on its price range (expecting a min and max)
// http://localhost:3000/listing/?min=100&max=200
router.get('/', getListingByPrice);

export default router;