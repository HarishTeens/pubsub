"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const routes_1 = __importDefault(require("./config/routes"));
const middlewares_1 = __importDefault(require("./middlewares"));
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
