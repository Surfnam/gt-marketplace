import mongoose from "mongoose";

const listingSchema = new mongoose.Schema({
    title: {
        type:String,
        required:true,
    },
    seller: {
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    description: {
        type:String,
        default:""
    },
    price: {
        type:Number,
        required:true,
    }, 
    category: {
        type:String,
        required:true,
    },
    condition:{
        type:String,
        required:true,
    }, 
    status: {
        type:String,
        required:true,
        enum: ['available', 'sold', 'unavailable'],
    }, 
    image: {
        type:String,
    }, 
    interestedUsers: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        default:[]
    }],
}, {timestamps:true})

// Static method to find by category
listingSchema.statics.findByCategory = function(category) {
    // Retrieves the first match for the query, otherwise returns null
    return this.find({category: category});
};

// Static method to find by price range
listingSchema.statics.findByPriceRange = function(min, max) {
    // Retrieves every match that falls within the price range
    return this.find({price: {$gte: min, $lte: max}});
};

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;