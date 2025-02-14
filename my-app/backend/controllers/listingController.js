import Listing from '../models/Listing.js';
import User from '../models/User.js';

export const addListing = async (req, res) => {
    try {
        const {id} = req.params
        const {title, price, condition, category, status, image} = req.body;
        const newListing = new Listing({
            title,
            seller: id,
            price,
            condition,
            category,
            status,
            image
        });
        const savedListing = await newListing.save();
        const updatedUser = await User.findByIdAndUpdate(
            id,
            { $push: {listings : savedListing._id} },
            { new: true }  // Option to return the updated document
          );

        
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
        const listings = await Listing.find({ status : 'available'}).select('title price category condition');
        console.log(listings)
        res.status(200).json({data: listings});
    } catch (err) {
        res.status(500).json( {error: err.message});
    }
}

export const getListingByCategory = async (req, res) => {
    try {
        const {category} = req.params;
        
        // Query the database for the category
        const listings = await Listing.findByCategory(category);

        // Case where listing is not found
        if (listings.length === 0) {
            return res.status(200).json({
                message: "No listings available in the category", 
                listings: []
            });
        }

        // Return the listing
        res.status(200).json(listings);
    } catch (err) {
        // Logging the error
        console.error(err);
        res.status(500).json({message: err.message});
    }
};

export const getListingByPrice = async (req, res) => {
    try {
        // Filtering based on min and max price ranges
        const {min, max} = req.query;
        // Converting min and max to numbers
        const minPrice = parseFloat(min);
        const maxPrice = parseFloat(max);

        // Query the database for the price range
        const listings = await Listing.findByPriceRange(minPrice, maxPrice);

        // Case where listing is not found
        if (listings.length === 0) {
            return res.status(200).json({
                message: "No listings available in the price range",
                listings: []
            });
        }

        // Return the listing
        res.status(200).json(listings);
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

