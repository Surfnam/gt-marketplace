import dotenv from "dotenv";
dotenv.config();


import mongoose from "mongoose";
import Listing from "../models/Listing.js";
import { getEmbedding } from "../utils/embedding.js";


const MONGO_URI = process.env.MONGO_URI;

const backfillListings = async () => {
  try {
    await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log("Connected to MongoDB for backfilling listings.");

    // Find listings that either lack the embedding field or have an empty embedding array.
    const listingsToUpdate = await Listing.find({
      $or: [
        { embedding: { $exists: false } },
        { embedding: { $size: 0 } },
        { embedding: { $size: 3072 } }
      ]
    });

    console.log(`Found ${listingsToUpdate.length} listings to update.`);

    
    for (const listing of listingsToUpdate) {
      if (listing.title) {
        const embedding = await getEmbedding(listing.title);
        listing.embedding = embedding;
        await listing.save();
        console.log(`Updated listing ${listing._id}`);
        await new Promise(r => setTimeout(r, 1000));
      } else {
        console.log(`Skipping listing ${listing._id} because title is missing.`);
      }
    }

    console.log("Backfilling complete.");
    await mongoose.disconnect();
  } catch (error) {
    console.error("Error during backfill:", error);
    process.exit(1);
  }
};

backfillListings();