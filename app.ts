import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
import run from './models/index';
import apis from './config/routes'

app.get("/", (_req, res) => {
    res.send("Welcome to easy crow!")
})


app.use(apis);

app.listen(3000, () => {
    console.log('Server Started');
    run();
    
})