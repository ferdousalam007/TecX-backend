"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const errorHandler_1 = __importDefault(require("./app/middlewares/errorHandler"));
const notFound_1 = __importDefault(require("./app/middlewares/notFound"));
const routes_1 = __importDefault(require("./app/routes"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)({
    origin: [
        // 'http://localhost:3000',
        process.env.CLIENT_URL
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));
app.use('/api', routes_1.default);
app.get('/', (req, res) => {
    res.send('Welcome to TecX app');
});
app.use(errorHandler_1.default);
app.use(notFound_1.default);
exports.default = app;