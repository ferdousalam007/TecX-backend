import express from 'express';
import auth from '../../middlewares/auth';
import {
  initPayment,
  paymentSuccess,
  paymentError,
  getAllPayments,
} from './payment.controller';

const router = express.Router();

router.get('/', auth('admin'), getAllPayments);
router.route('/init-payment').post(auth('user', 'admin'), initPayment);
router.post('/success/:userId/:transactionId', paymentSuccess);
router.post('/error/:transactionId', paymentError);

export const PaymentRoutes = router;
