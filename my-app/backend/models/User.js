import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        required:true,
        unique:true,
    },
    password: {
        type:String,
        required:true,
    }, 
    fullName: {
        type:String,
        required:true,
    },
    profilePicture: {
        type:String,
        default:'https://GTMarketplace.s3.us-east-005.backblazeb2.com/defaultPFP.jpg',
    },
    listings: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Listing',
        default:[]
    }], 
    savedListings: [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Listing',
        default:[]
    }],
    interestedListings:  [{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Listing',
        default:[]
    }],
    /*
    pastTransactions: {
        //define a trasaction schema?
    }
    */
})

const User = mongoose.model('User', userSchema);

export default User;