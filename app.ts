import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
import run from './models/index';


app.get("/", (req, res) => {
    res.send("Welcome to easy crow!")
})


app.listen(3000, () => {
    console.log('Server Started');
    run();
    
})