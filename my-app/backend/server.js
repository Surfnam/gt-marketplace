import express from 'express';
import mongoSetup from './db/mongo.js';
import dotenv from 'dotenv';
import testRoutes from './routes/testroutes.js';
import listingRoutes from './routes/listing.js';
import authRoutes from './routes/authRoutes.js';
import session from 'express-session';
//import crypto from 'crypto';
//const secret = crypto.randomBytes(32).toString('hex'); 
// generates a random session secret. 

const app = express();
dotenv.config();

app.use(express.json()); //parse req body
app.use(express.urlencoded({extended: true})); //parse form data
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 30,
        httpOnly: true, 
        secure: false, // true : cookie transmits only over https
    },
    //store: new MongoStore({mongooseConnection: mongoose.connection})
}))
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('hello world');
})

app.use('/testAPI', testRoutes);
app.use('/listing', listingRoutes);
app.use('/auth', authRoutes);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    mongoSetup();
})