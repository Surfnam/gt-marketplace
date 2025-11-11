import Listing from '../models/Listing.js';
import User from '../models/User.js';
import { getEmbedding } from '../utils/embedding.js';

import { EMBEDDING_SIMILARITY_THRESHOLD, K_NEAREST_NEIGHBORS, MAX_LISTINGS_PER_PAGE, MAX_USER_LISTINGS_PER_PAGE } from "../config/config.js";

export const addListing = async (req, res) => {
    try {
        const {id} = req.params;
        const { title } = req.body;

        /* Unfinished feature: prevent suspended users from adding listings --> will add after suspended users feature is complete
        const user = await User.findById(id);
        if (user && user.isSuspended) {
            return res.status(403).json({ error: 'Suspended users cannot add listings' });
        }
        */
        const embedding = await getEmbedding(title);
        const newListing = new Listing({
            ...req.body,
            seller: id,
            embedding,
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
};

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
};

export const getFilteredListings = async (req, res) => {
    try {
        const { page = 1, category, min = 0, max = 1000000, search, searchEmbedding } = req.body;
        console.log("category", category, category === "All");
        let query = {
          status: "available",
          price: { $gte: Number(min), $lte: Number(max)}
        };
    
        if (category && category !== "All")
          query.category = category;

        let listings, totalListings;
        if (search) {
            if (searchEmbedding && searchEmbedding.length > 0) {
                const [aggregation] = await Listing.aggregate([
                    { 
                        $search: { 
                            index: 'listingEmbeddingIndex',
                            knnBeta: {
                                vector: searchEmbedding,
                                path: 'embedding',
                                k: K_NEAREST_NEIGHBORS,
                            },
                        }
                    },
                    {
                        $addFields: { score: { $meta: "searchScore" } }
                    },
                    {
                        $match: { score: { $gte: EMBEDDING_SIMILARITY_THRESHOLD } } 
                    },
                    {
                        $match: query
                    },
                    { 
                        $sort: { score: -1 } 
                    },
                    { 
                        $facet: {
                            metadata: [{ $count: "total" }], // Total before pagination
                            data: [ // Paginated results
                                { $skip: (page - 1) * MAX_LISTINGS_PER_PAGE },
                                { $limit: MAX_LISTINGS_PER_PAGE }
                            ]
                        }
                    }
                ]);
                console.log(search)
                console.log("vector similarity finished")
                
                listings = aggregation?.data || [];
                totalListings = aggregation?.metadata?.[0]?.total || 0;
                console.log(listings.length);
            } else {
                // fallback regex search
                query.title = { $regex: search, $options: "i" };
                listings = await Listing.find(query)
                  .skip((page - 1) * PAGE_SIZE)
                  .limit(PAGE_SIZE);
                totalListings = await Listing.countDocuments(query);
            }
        } else {
            console.log("hi");
            listings = await Listing.find(query)
                .sort({ createdAt: -1 })
                .skip((page - 1) * MAX_LISTINGS_PER_PAGE)
                .limit(MAX_LISTINGS_PER_PAGE);

            totalListings = await Listing.countDocuments(query);
        }

        res.json({
          listings,
          totalPages: Math.ceil(totalListings / MAX_LISTINGS_PER_PAGE)
        });

      } catch (error) {
        console.error("Error fetching filtered listings:", error);
        res.status(500).json({ error: "Internal Server Error" });
      }
};

export const getActiveListings = async (req, res) => {
    try {
        const listings = await Listing.find({ status : 'available'})
            .select('title image price category condition');

        res.status(200).json({
            listings: listings,
        });
    } catch (err) {
        res.status(500).json( {error: err.message});
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
};

export const deleteListing = async (req, res) => {
    try {  
        const listingId = req.params.id;
        const deletedListing = await Listing.findByIdAndDelete(listingId);
        if (!deletedListing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        await User.findByIdAndUpdate(
            deletedListing.seller, 
            { $pull: { listings: listingId, inactiveListings: listingId } }, // Remove the listing ID from the array
            { new: true } // Return the updated user document
        );
        return res.status(200).json({ message: 'Listing deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete listing', error });
    }
};

export const deleteListingPaginated = async (req, res) => {
    try {  
        const listingId = req.params.id;
        const deletedListing = await Listing.findByIdAndDelete(listingId);
        if (!deletedListing) {
            return res.status(404).json({ message: 'Listing not found' });
        }

        const listingStatus = req.query.listingStatus;

        // Remove the listing ID from user (eithe from active or inactive array)
        const updateUser = listingStatus === "available"
            ? { $pull: { listings: listingId } }
            : { $pull: { inactiveListings: listingId } };

        await User.findByIdAndUpdate(
            deletedListing.seller, 
            updateUser,
            { new: true }
        );

        // Pagination: use the corresponding status for querying listings
        const page = parseInt(req.query.page) || 1;

        const sellerId = deletedListing.seller;
        
        const totalListings = await Listing.countDocuments({ seller: sellerId, status: listingStatus });
        const listings = await Listing.find({ seller: sellerId, status: listingStatus })
            .sort({ createdAt: -1 })
            .skip((page - 1) * MAX_USER_LISTINGS_PER_PAGE)
            .limit(MAX_USER_LISTINGS_PER_PAGE);

        return res.status(200).json({
            message: 'Listing deleted successfully',
            listings,
            totalPages: Math.ceil(totalListings / MAX_USER_LISTINGS_PER_PAGE)
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete listing', error });
    }
};


export const getListingEmbedding = async (req, res) => {
    const { text } = req.body;

    try {
        const embedding = await getEmbedding(text);
        res.json({ embedding });
    } catch (error) {
        if (error.status === 429) {
            console.log("REACHeD 429");
            return res.status(429).json({ error: "Too many requests. Please wait and try again later." });
        }

        res.status(500).json({ error: "Internal Server Error" });
    }
};
/*
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
*/
