"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_route_1 = require("../modules/user/user.route");
const post_route_1 = require("../modules/post/post.route");
const auth_route_1 = require("../modules/auth/auth.route");
const category_routes_1 = require("../modules/category/category.routes");
const comment_routes_1 = require("../modules/comment/comment.routes");
const payment_routes_1 = require("../modules/payment/payment.routes");
const analytics_routes_1 = require("../modules/analytics/analytics.routes");
const router = (0, express_1.Router)();
// Define the routes for each module
const moduleRoutes = [
    {
        path: '/auth',
        route: auth_route_1.AuthRoutes,
    },
    {
        path: '/users',
        route: user_route_1.UserRoutes,
    },
    {
        path: '/posts',
        route: post_route_1.PostRoutes,
    },
    {
        path: '/categories',
        route: category_routes_1.CategoryRoutes,
    },
    {
        path: '/comments',
        route: comment_routes_1.CommentRoutes,
    },
    {
        path: '/payments',
        route: payment_routes_1.PaymentRoutes,
    },
    {
        path: '/analytics',
        route: analytics_routes_1.AnalyticsRoutes,
    },
];
// Register each module route with the router
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
