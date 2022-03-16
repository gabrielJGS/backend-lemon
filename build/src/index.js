"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv-safe").config();
const app_1 = require("./app");
const port = process.env.PORT;
app_1.app.listen(port, () => {
    console.log('app is listening on ' + port);
});
