import express from 'express';
import mongoSetup from './db/mongo.js';
import dotenv from 'dotenv';
import cors from 'cors'; // Import cors
import http from 'http';
import testRoutes from './routes/testroutes.js';
import listingRoutes from './routes/listing.js';
import userRoutes from './routes/user.js'; // Correct import statement
import initializeSocket  from './socket-backend.js';
import messageRoutes from './routes/message.js';
import stripePackage from 'stripe';
import bodyParser from 'body-parser';

dotenv.config();

const stripe = stripePackage(process.env.STRIPE_SECRET_KEY); // Use your Stripe secret key from .env
const app = express();

app.use(cors()); // Use cors middleware
app.use(express.json()); //parse req body
app.use(express.urlencoded({extended: true})); //parse form data
app.use(bodyParser.json());

const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.send('hello world');
})

app.use('/testAPI', testRoutes);
app.use('/listing', listingRoutes);
app.use('/api/users', userRoutes); // Use the new user routes
app.use('/api/message', messageRoutes); // Use the new message routes

app.post('/create-payment-intent', async (req, res) => {
    const { paymentMethodId, amount, receivingAccount } = req.body;

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency: 'usd',
            payment_method: paymentMethodId,
            confirmation_method: 'manual',
            transfer_data: {
                destination: receivingAccount,
            },
        });

        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});

// Creating the server (http) const
const server = http.createServer(app);
initializeSocket(server);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    mongoSetup();
});