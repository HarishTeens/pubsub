import express from 'express';
import bodyParser from 'body-parser';

if (!process.env.ENV) {
    require('dotenv').config();
}

const app = express();
app.use(bodyParser.json());
import apis from './config/routes'
import middlewares from './middlewares';
 
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
    next()
});
app.get("/", (_req, res) => {
    res.send("Welcome to easy crow!")
})

app.use(middlewares.auth.default, apis);
app.use(middlewares.error.allErrorHandler);

app.use(apis);

app.listen(3001, () => {
    console.log('Server Started');
})

export default app;