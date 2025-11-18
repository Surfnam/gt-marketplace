import mongoose from 'mongoose';

const mongoSetup = async () => {
    try {
        console.log("Connecting to ", process.env.MONGO_URI);
        const connection = await mongoose.connect(process.env.MONGO_URI, { //
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        // const connection = await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connection success");
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

export default mongoSetup;