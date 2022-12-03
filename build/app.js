"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const index_1 = __importDefault(require("./models/index"));
app.get("/", (req, res) => {
    res.send("Welcome to easy crow!");
});
app.listen(3000, () => {
    console.log('Server Started');
    (0, index_1.default)();
});
