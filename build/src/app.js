"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const body_parser_1 = require("body-parser");
require("dotenv-safe").config();
const routes_1 = require("./config/routes");
const cors = require('cors');
const app = (0, express_1.default)();
exports.app = app;
app.use((0, body_parser_1.json)());
app.use(cors());
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, access-control-allow-origin");
    res.header("Access-Control-Expose-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, access-control-allow-origin");
    next();
});
app.use(routes_1.appRouter);
