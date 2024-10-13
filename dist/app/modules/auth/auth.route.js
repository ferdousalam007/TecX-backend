"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("./auth.controller");
const router = express_1.default.Router();
// Define routes for signup and signin
router.post('/signup', auth_controller_1.signup);
router.post('/signin', auth_controller_1.signin);
router.get('/logout', auth_controller_1.logout);
router.post('/forgot-password', auth_controller_1.forgotPassword);
router.patch('/reset-password/:token', auth_controller_1.resetPassword);
exports.AuthRoutes = router;
