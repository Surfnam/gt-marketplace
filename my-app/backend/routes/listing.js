import express from 'express'
import { addListing, getListingById } from '../controllers/listingController.js'

const router = express.Router();

// add new Listing
router.post('/:id', addListing) //id specifies the user id 

// get a specific listing based on its id
router.get('/:id', getListingById)

// // get a specific listing based on its category // example route for ticket #7 (not implemented right now)
// router.get('/category/:category')

export default router;