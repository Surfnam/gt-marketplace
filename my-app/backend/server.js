import express from 'express';
import mongoSetup from './db/mongo.js';
import dotenv from 'dotenv';
import cors from 'cors'; // Import cors
import http from 'http';
import session from 'express-session';
import testRoutes from './routes/testroutes.js';
import listingRoutes from './routes/listing.js';
import userRoutes from './routes/user.js'; // Correct import statement
import initializeSocket  from './socket-backend.js';
import messageRoutes from './routes/message.js';
import fileUpload from './routes/fileUpload.js';
import bodyParser from 'body-parser';
import stripePackage from 'stripe';

const app = express();
dotenv.config({ override: true });

const corsOptions = {
    origin: 'http://localhost:3000', // Allow your frontend origin
    credentials: true, // Allow cookies to be sent with the request
};

// const stripe = stripePackage(process.env.STRIPE_SECRET_KEY); // Use your Stripe secret key from .env

app.use(cors(corsOptions)); // Use cors middleware
app.use(express.json()); //parse req body
app.use(express.urlencoded({extended: true})); //parse form data
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.send('hello world');
})
app.use(session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 30,
        httpOnly: true, 
        secure: false, // true : cookie transmits only over https
        saneSite: 'none',
    },
    //store: new MongoStore({mongooseConnection: mongoose.connection})
}))

app.use('/testAPI', testRoutes);
app.use('/listing', listingRoutes);
app.use('/api/users', userRoutes); // Use the new user routes
app.use('/api/message', messageRoutes); // Use the new message routes
app.use('/api/fileUpload', fileUpload);

// Creating the server (http) const
const server = http.createServer(app);
initializeSocket(server);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    mongoSetup();
    console.log(process.env.AWS_SECRET_ACCESS_KEY);
});

