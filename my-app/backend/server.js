import express from 'express';
import mongoSetup from './db/mongo.js';
import dotenv from 'dotenv';
import cors from 'cors'; // Import cors
import testRoutes from './routes/testroutes.js';
import listingRoutes from './routes/listing.js';
import userRoutes from './routes/user.js';

const app = express();
dotenv.config();

app.use(cors()); // Use cors middleware
app.use(express.json()); //parse req body
app.use(express.urlencoded({extended: true})); //parse form data

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('hello world');
})

app.use('/testAPI', testRoutes);
app.use('/listing', listingRoutes);
app.use('/api/users', userRoutes); // Use the new user routes

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    mongoSetup();
});