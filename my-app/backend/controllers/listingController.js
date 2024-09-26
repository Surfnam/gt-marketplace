import Listing from '../models/Listing.js';

export const addListing = async (req, res) => {
    try {
        const {id} = req.params
        const {title, price, condition, category, status} = req.body;
        console.log(title, id, price, condition, category, status);
        const newListing = new Listing({
            title,
            seller: id,
            price,
            condition,
            category,
            status,
        });

        const savedListing = await newListing.save();
        res.status(201).json({message: "listing saved", listingId: savedListing._id});
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
        const listings = await Listing.find({ status : 'available'}).select('title');
        
        res.status(200).json(listings);
    } catch (err) {
        res.status(500).json( {error: err.message});
    }
}

export const getListingByCategory = async (req, res) => {
    try {
        const {category} = req.params;
        
        // Query the database for the category
        const listings = await Listing.findByCategory({category});

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

        // Query the database for the price range
        const listings = await Listing.findByPriceRange(min, max);

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

