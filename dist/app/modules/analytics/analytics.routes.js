"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const analytics_controller_1 = require("./analytics.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const router = express_1.default.Router();
// Updated routes for clarity and consistency
router.route('/model-counts').get((0, auth_1.default)('admin'), analytics_controller_1.getModelCounts);
router.route('/posts-metrics').get(analytics_controller_1.getPostsMetrics);
router.route('/payments-metrics').get((0, auth_1.default)('admin'), analytics_controller_1.getPaymentMetrics);
exports.AnalyticsRoutes = router;
// auth('admin'),
