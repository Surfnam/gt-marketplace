import Listing from '../models/Listing.js';
import User from '../models/User.js';

const MAX_LISTINGS_PER_PAGE = 3;

export const addListing = async (req, res) => {
    try {
        console.log("endpoint")
        console.log("req.body: ", req.body);
        const {id} = req.params
        const newListing = new Listing({
            ...req.body,
            seller: id,
        });
        const savedListing = await newListing.save();
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $push: {listings : savedListing._id} },
            { new: true }  // Option to return the updated document
          );
          console.log("userid at listing", id)
        
        res.status(201).json({message: "listing saved", newListing});
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

export const getListingById = async (req, res) => {
    try {
        const {id} = req.params; 
        const listing = await Listing.findById(id);  // Query the database for the listing

        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });  // Handle case where listing doesn't exist
        }

        res.status(200).json(listing);  // Return the found listing
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getListingsBySeller = async (req, res) => {
    try {
        const {id} = req.params; 
        const listings = await Listing.find({seller: id});  // Query the database for the listings

        if (!listings || listings.length === 0) {
            return res.status(404).json({ message: "No listings found for the specified seller" });  // Handle case where seller has no listings
        }

        res.status(200).json(listings);  // Return the found listings
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


export const getListingsByCondition = async (req, res) => {
    try {
        const {condition} = req.params;
        const listings = await Listing.find({ condition }).select('title price');
        
        res.status(200).json(listings);
    } catch (err) {
        res.status(500).json( {error: err.message} );
    }

}

export const getActiveListings = async (req, res) => {
    try {
        let { page=1 } = req.query;
        page = parseInt(page);

        const totalListings = await Listing.countDocuments({ status: 'available' });

        const listings = await Listing.find({ status : 'available'})
            .skip((page - 1) * MAX_LISTINGS_PER_PAGE)
            .limit(MAX_LISTINGS_PER_PAGE)
            .select('title image price category condition');

        res.status(200).json({
            listings: listings,
            totalPages: Math.ceil(totalListings / MAX_LISTINGS_PER_PAGE),
        });
    } catch (err) {
        res.status(500).json( {error: err.message});
    }
}

export const getListingByCategory = async (req, res) => {
    try {
        let { page=1 } = req.query;
        page = parseInt(page);

        const {category} = req.params;
        
        const totalListings = await Listing.countDocuments({ category });
        
        // Query the database for the category
        const listings = await Listing.find({ category })
            .skip((page - 1) * MAX_LISTINGS_PER_PAGE)
            .limit(MAX_LISTINGS_PER_PAGE)
            .select('title image price category condition');

        // Return the listing
        res.status(200).json({
            listings,
            totalPages: Math.ceil(totalListings / MAX_LISTINGS_PER_PAGE),
        });
    } catch (err) {
        // Logging the error
        console.error(err);
        res.status(500).json({message: err.message});
    }
};

export const getListingByPrice = async (req, res) => {
    try {
        // Filtering based on min and max price ranges
        let {min, max, page=1} = req.query;
        // Converting min and max to numbers
        min = parseFloat(min);
        max = parseFloat(max);

        const totalListings = await Listing.countDocuments({
            price: { $gte: minPrice, $lte: maxPrice }
        });

        // Query the database for the price range
        const listings = await Listing.find({
            price: { $gte: minPrice, $lte: maxPrice }
        })
        .skip((page - 1) * limit)
        .limit(limit)
        .select("title image price category condition");

        res.status(200).json({
            listings,
            totalPages: Math.ceil(totalListings / limit),
        });
    } catch (err) {
        // Logging the error
        console.error(err);
        res.status(500).json({message: err.message});
    }
};

export const updateListing = async (req, res) => {
    try {
        const listingId = req.params.id; 
        const updates = req.body;     // Fields to update are sent in req.body

        // Remove any fields that are undefined (not provided in the request)
        const filteredUpdates = Object.fromEntries(
            Object.entries(updates).filter(([_, value]) => value !== undefined)
        );

        // Use findByIdAndUpdate with $set to update only specified fields
        const updatedListing = await Listing.findByIdAndUpdate(
            listingId,
            { $set: filteredUpdates },
            { new: true }  // Option to return the updated document
        );

        if (!updatedListing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        res.status(200).json({ listing: updatedListing });
    } 
    catch (error) {
        res.status(500).json({ message: 'Failed to update listing', error });
    }
}

export const deleteListing = async (req, res) => {

    try {  
        const listingId = req.params.id;
        const deletedListing = await Listing.findByIdAndDelete(listingId);
        if (!deletedListing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        await User.findByIdAndUpdate(
            deletedListing.seller, // Assuming `seller` field stores user ID
            { $pull: { listings: listingId, inactiveListings: listingId } }, // Remove the listing ID from the array
            { new: true } // Return the updated user document
        );
        return res.status(200).json({ message: 'Listing deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete listing', error });
    }
};