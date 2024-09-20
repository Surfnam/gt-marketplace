import mongoose from 'mongoose';

const mongoSetup = async () => {
    try{
        const connection = await mongoose.connect(process.env.MONGO_URI)
        console.log("mongo connection success");
    } catch(error) {
        console.error('error connecting to mongo')
        process.exit(1);
    }
}

export default mongoSetup;