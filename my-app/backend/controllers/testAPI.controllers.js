import User from '../models/User.js';
import Listing from '../models/Listing.js';

export const addUser = async (req, res) => {

    try {
        const {username, password, fullName} = req.body;

        const newUser = new User({
            username,
            password,
            fullName,
        });

        const savedUser = await newUser.save();
        res.status(201).json({message: "user saved", userId: savedUser._id});
    } catch (err) {
        res.status(500).json({error:err.message});
    }
}

export const addListing = async (req, res) => {
    try {
        const {id} = req.params
        const {title, price, condition, category, status} = req.body;
        console.log(title, seller, price, condition, category, status);
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

export const deleteUsersandListings = async (req, res) => {
    try {
        const {userId, listingId} = req.body;
        if (userId) {
            await User.findByIdAndDelete(userId);
            res.status(200).json({message: "deleted User"});
        } 
        else if(listingId) {
            await Listing.findByIdAndDelete(listingId);
            res.status(200).json({message: "deleted Listing"});
        } else {
            await User.find().deleteMany();
            await Listing.find().deleteMany();
            res.status(200).json({message: "deleted All"});
        }
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}

export const updateUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const updates = req.body;

        const updatedUser = await User.findByIdAndUpdate(userId, updates);

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({message: "user updated"});
        
    } catch (err) {
        res.status(500).json({error: "failed to update User"});
    }
}

export const updateListing = async (req, res) => {
    try {
        const listingId = req.params.id;
        const updates = req.body;

        const updatedListing = await Listing.findByIdAndUpdate(listingId, updates);

        if (!updatedListing) {
            return res.status(404).json({ message: "Listing not found" });
        }

        res.status(200).json({message: "listing updated"});
        
    } catch (err) {
        res.status(500).json({error: "failed to update Listing"});
    }
}