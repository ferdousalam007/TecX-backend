import express from 'express';
import {
  getModelCounts,
  getPaymentMetrics,
  getPostsMetrics,
} from './analytics.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

// Updated routes for clarity and consistency
router.route('/model-counts').get(auth('admin'), getModelCounts);
router.route('/posts-metrics').get(getPostsMetrics);
router.route('/payments-metrics').get(auth('admin'), getPaymentMetrics);

export const AnalyticsRoutes = router;
// auth('admin'),
