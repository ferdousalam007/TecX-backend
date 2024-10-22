"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const user_controller_1 = require("./user.controller");
const router = express_1.default.Router();
router.use((0, auth_1.default)('admin', 'user'));
router.get('/me', user_controller_1.getMe);
router.patch('/me', user_controller_1.updateMe);
router.route('/').get(user_controller_1.getAllUsers).post(user_controller_1.createUser);
router.route('/:id').get(user_controller_1.getUser).patch(user_controller_1.updateUser).delete(user_controller_1.deleteUser);
exports.UserRoutes = router;
