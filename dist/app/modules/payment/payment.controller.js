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
exports.getAllPayments = exports.paymentError = exports.paymentSuccess = exports.initPayment = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sslcommerz_lts_1 = __importDefault(require("sslcommerz-lts"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const factory = __importStar(require("../../utils/handlerFactory"));
const user_model_1 = __importDefault(require("../user/user.model"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const payment_model_1 = __importDefault(require("./payment.model"));
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = false;
exports.initPayment = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield user_model_1.default.findById(req.user.userId);
    if (!user)
        return next(new AppError_1.default(http_status_1.default.NOT_FOUND, `User not found`));
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
    const sslcz = new sslcommerz_lts_1.default(store_id, store_passwd, is_live);
    // Save initial payment in the database as "Pending"
    yield payment_model_1.default.create({
        user: req.user.userId,
        tran_id: transactionId,
        amount: data.total_amount,
        currency: data.currency,
        payment_status: 'pending',
    });
    sslcz.init(data).then((apiResponse) => {
        // Redirect the user to payment gateway
        const GatewayPageURL = apiResponse.GatewayPageURL;
        res.status(http_status_1.default.OK).json({
            success: true,
            statusCode: http_status_1.default.OK,
            message: `Payment initiated successfully`,
            data: GatewayPageURL,
        });
    });
}));
exports.paymentSuccess = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, transactionId } = req.params;
    yield Promise.all([
        user_model_1.default.findByIdAndUpdate(userId, { isVerified: true }),
        payment_model_1.default.findOneAndUpdate({ tran_id: transactionId }, { payment_status: 'completed' }),
    ]);
    res.redirect(`${process.env.CLIENT_URL}/payment/success`);
}));
exports.paymentError = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId } = req.params;
    yield payment_model_1.default.findOneAndUpdate({ tran_id: transactionId }, { payment_status: 'failed' });
    res.redirect(`${process.env.CLIENT_URL}/payment/error`);
}));
exports.getAllPayments = factory.getAll(payment_model_1.default, 'user');
