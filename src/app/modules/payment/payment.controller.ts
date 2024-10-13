import httpStatus from 'http-status';
import SSLCommerzPayment from 'sslcommerz-lts';
import catchAsync from '../../utils/catchAsync';
import * as factory from '../../utils/handlerFactory';
import User from '../user/user.model';
import AppError from '../../errors/AppError';
import Payment from './payment.model';

const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = false;

export const initPayment = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.user.userId);
  if (!user) return next(new AppError(httpStatus.NOT_FOUND, `User not found`));
  const transactionId = `TXN${Date.now()}`;
  const data = {
    total_amount: 2000,
    currency: 'BDT',
    tran_id: transactionId,
    success_url: `${process.env.API_URL}/payments/success/${req.user.userId}/${transactionId}`,
    fail_url: `${process.env.API_URL}/payments/error/${transactionId}`,
    cancel_url: `${process.env.API_URL}/payments/error/${transactionId}`,
    ipn_url: 'http://localhost:3030/ipn',
    shipping_method: 'Online',
    product_name: 'Subscription',
    product_category: 'Subscription',
    product_profile: 'general',
    cus_name: user.name || '',
    cus_email: user.email || '',
    cus_add1: 'Dhaka',
    cus_add2: 'Dhaka',
    cus_city: 'Dhaka',
    cus_state: 'Dhaka',
    cus_postcode: '1000',
    cus_country: 'Bangladesh',
    cus_phone: '01711111111',
    cus_fax: '01711111111',
    ship_name: user.name || '',
    ship_add1: 'Dhaka',
    ship_add2: 'Dhaka',
    ship_city: 'Dhaka',
    ship_state: 'Dhaka',
    ship_postcode: 1000,
    ship_country: 'Bangladesh',
  };
  const sslcz = new SSLCommerzPayment(
    store_id as string,
    store_passwd as string,
    is_live,
  );
  // Save initial payment in the database as "Pending"
  await Payment.create({
    user: req.user.userId,
    tran_id: transactionId,
    amount: data.total_amount,
    currency: data.currency,
    payment_status: 'pending',
  });

  sslcz.init(data).then((apiResponse) => {
    // Redirect the user to payment gateway
    const GatewayPageURL = apiResponse.GatewayPageURL;
    res.status(httpStatus.OK).json({
      success: true,
      statusCode: httpStatus.OK,
      message: `Payment initiated successfully`,
      data: GatewayPageURL,
    });
  });
});

export const paymentSuccess = catchAsync(async (req, res) => {
  const { userId, transactionId } = req.params;
  await Promise.all([
    User.findByIdAndUpdate(userId, { isVerified: true }),
    Payment.findOneAndUpdate(
      { tran_id: transactionId },
      { payment_status: 'completed' },
    ),
  ]);

  res.redirect(`${process.env.CLIENT_URL}/payment/success`);
});

export const paymentError = catchAsync(async (req, res) => {
  const { transactionId } = req.params;
  await Payment.findOneAndUpdate(
    { tran_id: transactionId },
    { payment_status: 'failed' },
  );
  res.redirect(`${process.env.CLIENT_URL}/payment/error`);
});

export const getAllPayments = factory.getAll(Payment, 'user');
