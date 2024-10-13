"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const post_controller_1 = require("./post.controller");
const router = express_1.default.Router();
router.route('/').get(post_controller_1.getAllPosts).post((0, auth_1.default)('admin', 'user'), post_controller_1.createPost);
router.get('/allpost', post_controller_1.getAllPost);
router.get('/my-posts', (0, auth_1.default)('user', 'admin'), post_controller_1.getMyPosts);
router
    .route('/:id')
    .get(post_controller_1.getPost)
    .patch((0, auth_1.default)('admin', 'user'), post_controller_1.updatePost)
    .delete((0, auth_1.default)('admin', 'user'), post_controller_1.deletePost);
exports.PostRoutes = router;
