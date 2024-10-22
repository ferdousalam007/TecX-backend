"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const comment_controller_1 = require("./comment.controller");
const router = express_1.default.Router();
router
    .route('/')
    .get(comment_controller_1.getAllComments)
    .post((0, auth_1.default)('admin', 'user'), comment_controller_1.createComment);
router
    .route('/:id')
    .get(comment_controller_1.getComment)
    .patch((0, auth_1.default)('admin', 'user'), comment_controller_1.updateComment)
    .delete((0, auth_1.default)('admin', 'user'), comment_controller_1.deleteComment);
exports.CommentRoutes = router;
