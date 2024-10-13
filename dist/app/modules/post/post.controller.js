"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.updatePost = exports.getMyPosts = exports.getAllPosts = exports.getAllPost = exports.getPost = exports.createPost = void 0;
const http_status_1 = __importDefault(require("http-status"));
const apiFeatures_1 = __importDefault(require("../../utils/apiFeatures"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const factory = __importStar(require("../../utils/handlerFactory"));
const post_model_1 = __importDefault(require("./post.model"));
const comment_model_1 = __importDefault(require("../comment/comment.model"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
exports.createPost = factory.createOne(post_model_1.default);
exports.getPost = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Find and increment the viewsCount field by 1
    const post = yield post_model_1.default.findByIdAndUpdate(id, { $inc: { viewsCount: 1 } }, // Increment viewsCount by 1
    { new: true } // Return the updated document
    ).populate('author category', 'name email profilePic');
    // Check if post exists
    if (!post) {
        return next(new AppError_1.default(http_status_1.default.NOT_FOUND, `Post not found`));
    }
    // Retrieve comments for the post
    const comments = yield comment_model_1.default.find({ post: id }).populate('author', 'name email profilePic');
    // SEND RESPONSE
    res.status(http_status_1.default.OK).json({
        success: true,
        statusCode: http_status_1.default.OK,
        message: `Post retrieved successfully`,
        data: Object.assign(Object.assign({}, post.toObject()), { comments }),
    });
}));
// export const getPost = catchAsync(async (req, res, next) => {
//   const { id } = req.params;
//   const post = await Post.findById(id).populate(
//     'author category',
//     'name email profilePic',
//   );
//   if (!post) {
//     return next(new AppError(httpStatus.NOT_FOUND, `Post not found`));
//   }
//   const comments = await Comment.find({ post: id }).populate(
//     'author',
//     'name email profilePic',
//   );
//   // SEND RESPONSE
//   res.status(httpStatus.OK).json({
//     success: true,
//     statusCode: httpStatus.OK,
//     message: `Posts retrieved successfully`,
//     data: {
//       ...post.toObject(),
//       comments,
//     },
//   });
// });
exports.getAllPost = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const posts = yield post_model_1.default.find().populate('author category', 'name email profilePic');
    // SEND RESPONSE
    res.status(http_status_1.default.OK).json({
        success: true,
        statusCode: http_status_1.default.OK,
        message: `Posts retrieved successfully`,
        data: posts,
    });
}));
exports.getAllPosts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // APi features
    const features = new apiFeatures_1.default(post_model_1.default.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    // POPULATE
    const posts = yield features.query
        .populate('author category', 'name email profilePic')
        .lean();
    // Add total comments to each post
    const postsWithCommentCount = yield Promise.all(posts.map((post) => __awaiter(void 0, void 0, void 0, function* () {
        const commentCount = yield comment_model_1.default.countDocuments({ post: post._id });
        return Object.assign(Object.assign({}, post), { totalComments: commentCount });
    })));
    // SEND RESPONSE
    res.status(http_status_1.default.OK).json({
        success: true,
        statusCode: http_status_1.default.OK,
        message: `Posts retrieved successfully`,
        data: postsWithCommentCount,
    });
}));
exports.getMyPosts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // APi features
    const features = new apiFeatures_1.default(post_model_1.default.find({ author: req.user.userId }), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();
    // POPULATE
    const posts = yield features.query
        .populate('author category', 'name email profilePic')
        .lean();
    // Add total comments to each post
    const postsWithCommentCount = yield Promise.all(posts.map((post) => __awaiter(void 0, void 0, void 0, function* () {
        const commentCount = yield comment_model_1.default.countDocuments({ post: post._id });
        return Object.assign(Object.assign({}, post), { totalComments: commentCount });
    })));
    // SEND RESPONSE
    res.status(http_status_1.default.OK).json({
        success: true,
        statusCode: http_status_1.default.OK,
        message: `Posts retrieved successfully`,
        data: postsWithCommentCount,
    });
}));
exports.updatePost = factory.updateOne(post_model_1.default);
exports.deletePost = factory.deleteOne(post_model_1.default);
