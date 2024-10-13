"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const postSchema = new mongoose_1.Schema({
    title: {
        type: String,
        trim: true,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    author: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    category: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    images: {
        type: [String],
        default: [],
    },
    isPremium: {
        type: Boolean,
        default: false,
    },
    upvotes: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
            default: [],
        },
    ],
    downvotes: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
            default: [],
        },
    ],
    viewsCount: {
        type: Number,
        default: 0,
    },
}, {
    timestamps: true,
});
const Post = (0, mongoose_1.model)('Post', postSchema);
exports.default = Post;
