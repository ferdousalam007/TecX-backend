"use strict";
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
exports.getPaymentMetrics = exports.getPostsMetrics = exports.getModelCounts = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const category_model_1 = __importDefault(require("../category/category.model"));
const comment_model_1 = __importDefault(require("../comment/comment.model"));
const payment_model_1 = __importDefault(require("../payment/payment.model"));
const post_model_1 = __importDefault(require("../post/post.model"));
const user_model_1 = __importDefault(require("../user/user.model"));
exports.getModelCounts = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.countDocuments();
    const post = yield post_model_1.default.countDocuments();
    const category = yield category_model_1.default.countDocuments();
    const totalViews = yield post_model_1.default.aggregate([
        {
            $group: {
                _id: null,
                totalViews: { $sum: "$viewsCount" }, // Summing the viewsCount
            },
        },
    ]);
    const viewsCount = totalViews.length > 0 ? totalViews[0].totalViews : 0;
    res.json({ user, post, category, viewsCount });
}));
exports.getPostsMetrics = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 29);
    // Aggregate posts by creation date
    const posts = yield post_model_1.default.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate, $lte: endDate },
            },
        },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                postCount: { $sum: 1 },
                totalViewsCount: { $sum: '$viewsCount' },
            },
        },
    ]);
    // Aggregate comments by post creation date
    const comments = yield comment_model_1.default.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate, $lte: endDate },
            },
        },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                commentCount: { $sum: 1 },
            },
        },
    ]);
    // Aggregate upvotes by post creation date
    const upvotes = yield post_model_1.default.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate, $lte: endDate },
            },
        },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                upvoteCount: { $sum: { $size: '$upvotes' } }, // Counting upvotes per post
            },
        },
    ]);
    // Mapping post, comment, and upvote counts by date
    const postMap = new Map(posts.map((p) => [p._id, { postCount: p.postCount, viewsCount: p.totalViewsCount }]));
    const commentMap = new Map(comments.map((c) => [c._id, c.commentCount]));
    const upvoteMap = new Map(upvotes.map((u) => [u._id, u.upvoteCount]));
    // Prepare the result with all three datasets
    const resultData = Array.from({ length: 30 }, (_, i) => {
        var _a;
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateString = date.toISOString().split('T')[0];
        return {
            date: dateString,
            postCount: postMap.get(dateString) || 0,
            commentCount: commentMap.get(dateString) || 0,
            upvoteCount: upvoteMap.get(dateString) || 0,
            viewsCount: ((_a = postMap.get(dateString)) === null || _a === void 0 ? void 0 : _a.viewsCount) || 0,
        };
    });
    res.json(resultData);
}));
exports.getPaymentMetrics = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const endDate = new Date();
    const startDate = new Date(endDate);
    startDate.setDate(startDate.getDate() - 29);
    const payments = yield payment_model_1.default.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate, $lte: endDate },
                payment_status: 'completed',
            },
        },
        {
            $group: {
                _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                totalAmount: { $sum: '$amount' },
            },
        },
    ]);
    const paymentMap = new Map(payments.map((payment) => [payment._id, payment.totalAmount]));
    const paymentData = Array.from({ length: 30 }, (_, i) => {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);
        const dateString = date.toISOString().split('T')[0];
        return { date: dateString, totalAmount: paymentMap.get(dateString) || 0 };
    });
    res.json(paymentData);
}));
