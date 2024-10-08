import express from 'express';
import mongoSetup from './db/mongo.js';
import dotenv from 'dotenv';
import testRoutes from './routes/testroutes.js';
import listingRoutes from './routes/listing.js';
import cors from 'cors';
import http from 'http';

const app = express();
dotenv.config();

app.use(express.json()); //parse req body
app.use(express.urlencoded({extended: true})); //parse form data

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('hello world');
})

app.use('/testAPI', testRoutes);
app.use('/listing', listingRoutes);
app.use(cors); // Library for socket.io

// Creating the server (http) const
const server = http.createServer(app);
initializeSocket(server);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    mongoSetup();
})