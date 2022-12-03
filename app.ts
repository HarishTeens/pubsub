import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
import run from './models/index';
import apis from './config/routes'
import middlewares from './middlewares';
 


app.get("/", (_req, res) => {
    res.send("Welcome to easy crow!")
})

app.use(middlewares.auth.default, apis);
app.use(middlewares.error.allErrorHandler);

app.use(apis);

app.listen(3001, () => {
    console.log('Server Started');
})