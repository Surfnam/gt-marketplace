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