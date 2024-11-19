import express from 'express';
import mongoSetup from './db/mongo.js';
import cors from 'cors'; // Import cors
import http from 'http';
import testRoutes from './routes/testroutes.js';
import listingRoutes from './routes/listing.js';
import userRoutes from './routes/user.js'; // Correct import statement
import bodyParser from 'body-parser';
import initializeSocket  from './socket-backend.js';
import messageRoutes from './routes/message.js';
import dotenv from 'dotenv';
import stripePackage from 'stripe';

dotenv.config({ override: true });

const corsOptions = {
    origin: 'http://localhost:3000', // Allow your frontend origin
    credentials: true, // Allow cookies to be sent with the request
};

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY); // Use your Stripe secret key from .env
const app = express();

app.use(cors(corsOptions)); // Use cors middleware
app.use(express.json()); //parse req body
app.use(express.urlencoded({ extended: true })); //parse form data
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.send('hello world');
});

app.use('/testAPI', testRoutes);
app.use('/listing', listingRoutes);
app.use('/api/users', userRoutes); // Use the new user routes
app.use('/api/message', messageRoutes); // Use the new message routes

const server = http.createServer(app); // Creating the server (http)
initializeSocket(server);
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    mongoSetup();
    console.log(process.env.AWS_SECRET_ACCESS_KEY);
});
