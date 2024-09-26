import express from 'express'
import { addListing, getListingById, getListingsByCondition, getActiveListings} from '../controllers/listingController.js'

const router = express.Router();

// get all listings (this needs to be above the get request for '/:id' so that 'active' does not get confused as id)
router.get('/active', getActiveListings);

// add new Listing
router.post('/:id', addListing) //id specifies the user id 

// get a specific listing based on its id
router.get('/:id', getListingById)

// // get a specific listing based on its category // example route for ticket #7 (not implemented right now)
// router.get('/category/:category')


// get listings based on condition
router.get('/condition/:condition', getListingsByCondition);


export default router;