"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
if (!process.env.ENV) {
    require('dotenv').config();
}
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
const routes_1 = __importDefault(require("./config/routes"));
const middlewares_1 = __importDefault(require("./middlewares"));
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.get("/", (_req, res) => {
    res.send("Welcome to easy crow!");
});
app.use(middlewares_1.default.auth.default, routes_1.default);
app.use(middlewares_1.default.error.allErrorHandler);
app.use(routes_1.default);
app.listen(3001, () => {
    console.log('Server Started');
});
exports.default = app;
