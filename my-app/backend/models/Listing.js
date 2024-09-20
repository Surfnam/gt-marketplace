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
        type:String
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

const Listing = mongoose.model("Listing", listingSchema);

export default Listing;