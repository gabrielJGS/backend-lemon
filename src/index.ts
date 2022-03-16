import express from 'express';
import { json } from 'body-parser';
require("dotenv-safe").config();

import { appRouter } from './config/routes';
const cors = require('cors')

const app = express();
const port = process.env.PORT;

app.use(json());
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, access-control-allow-origin");
    res.header("Access-Control-Expose-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, access-control-allow-origin");
    next();
});
app.use(appRouter);

app.listen(port, () => {
    console.log('app is listening on ' + port);
})
