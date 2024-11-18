import express from 'express';
import mongoSetup from './db/mongo.js';
import dotenv from 'dotenv';
import cors from 'cors'; // Import cors
import http from 'http';
import testRoutes from './routes/testroutes.js';
import listingRoutes from './routes/listing.js';
import userRoutes from './routes/user.js'; // Correct import statement
import session from 'express-session';
import authRoutes from './routes/authRoutes.js'

const app = express();
dotenv.config();

const corsOptions = {
    origin: 'http://localhost:3000', // frontend URL
    credentials: true, // important for allowing cookies to be sent
  };

app.use(cors(corsOptions)); // Use cors middleware
app.use(express.json()); //parse req body
app.use(express.urlencoded({extended: true})); //parse form data

//app.use(cookieParser());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 1000 * 60 * 30,
        httpOnly: true, 
        secure: false, // true : cookie transmits only over https
        saneSite: 'none',
    },
    //store: new MongoStore({mongooseConnection: mongoose.connection})
}))
const port = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.send('hello world');
})

app.use('/testAPI', testRoutes);
app.use('/listing', listingRoutes);
app.use('/auth', authRoutes);
app.use('/api/users', userRoutes); // Use the new user routes
app.use('/api/message', messageRoutes); // Use the new message routes

// Creating the server (http) const
const server = http.createServer(app);
initializeSocket(server);

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    mongoSetup();
});