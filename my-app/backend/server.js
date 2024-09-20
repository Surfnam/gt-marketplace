import express from 'express';
import mongoSetup from './db/mongo.js';
import dotenv from 'dotenv';
import testRoutes from './routes/testroutes.js';

const app = express();
dotenv.config();

app.use(express.json()); //parse req body
app.use(express.urlencoded({extended: true})); //parse form data

const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('hello world');
})

app.use('/testAPI', testRoutes);

app.listen(port, () => {
    console.log('server is running');
    mongoSetup();
})