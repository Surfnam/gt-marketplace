import express from 'express'
import { addListing, getListingById, getListingsByCondition, getActiveListings, getListingByCategory, getListingByPrice} from '../controllers/listingController.js'

const router = express.Router();

// get all listings (this needs to be above the get request for '/:id' so that 'active' does not get confused as id)
router.get('/active', getActiveListings);

// add new Listing
router.post('/:id', addListing) //id specifies the user id 

// get a specific listing based on its id
router.get('/:id', getListingById)

// Get a specific listing based on its category
router.get('/category/:category', getListingByCategory)

// Get a specific listing based on its price range (expecting a min and max)
router.get('/price', getListingByPrice);


// get listings based on condition
router.get('/condition/:condition', getListingsByCondition);


export default router;