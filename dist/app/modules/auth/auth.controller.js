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
exports.resetPassword = exports.forgotPassword = exports.logout = exports.signin = exports.signup = void 0;
const http_status_1 = __importDefault(require("http-status"));
const crypto_1 = __importDefault(require("crypto"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const user_model_1 = __importDefault(require("../user/user.model"));
const AppError_1 = __importDefault(require("../../errors/AppError"));
const auth_utils_1 = require("./auth.utils");
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.signup = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const existingUser = yield user_model_1.default.findOne({
        email: req.body.email,
        isDeleted: false,
    });
    if (existingUser) {
        return next(new AppError_1.default(http_status_1.default.CONFLICT, 'User already exists with this email'));
    }
    const newUser = yield user_model_1.default.create(req.body);
    return (0, auth_utils_1.createAndSendToken)(newUser, res);
}));
exports.signin = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const isEmail = yield user_model_1.default.findOne({ email, isDeleted: false });
    if (!isEmail) {
        return next(new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Incorrect email or password'));
    }
    const user = yield user_model_1.default.findOne({ email, isDeleted: false }).select('+password');
    if (!user)
        return next(new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found'));
    if (user.isBlocked) {
        return next(new AppError_1.default(http_status_1.default.FORBIDDEN, 'Your account has been blocked'));
    }
    const isPasswordMatched = yield user_model_1.default.isPasswordMatched(password, user.password);
    if (!isPasswordMatched) {
        return next(new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Incorrect email or password'));
    }
    user.loggedInAt = new Date();
    yield user.save({ validateBeforeSave: false });
    return (0, auth_utils_1.createAndSendToken)(user, res);
}));
const logout = (req, res) => {
    res.cookie('jwt', null, {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true,
    });
    res.status(200).json({
        status: 'success',
    });
};
exports.logout = logout;
exports.forgotPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const user = yield user_model_1.default.findOne({
        email: req.body.email,
        isDeleted: false,
        isBlocked: false,
    });
    if (!user) {
        return next(new AppError_1.default(http_status_1.default.NOT_FOUND, 'No user found with this email address or account is blocked'));
    }
    const resetToken = user.createPasswordResetToken();
    yield user.save({ validateBeforeSave: false });
    try {
        const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        // eslint-disable-next-line prefer-const
        const transporter = nodemailer_1.default.createTransport({
            service: 'gmail',
            port: 587,
            secure: false,
            auth: {
                user: process.env.EMAIL,
                pass: process.env.EMAIL_PASSWORD,
            },
            logger: true,
            debug: true,
        });
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'Reset your password',
            text: `Click the following link to reset your password: ${resetURL}`,
        };
        const info = yield transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!',
        });
    }
    catch (error) {
        console.log(error);
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        yield user.save({ validateBeforeSave: false });
        return next(new AppError_1.default(500, 'There was an error sending the email. Please try again later!'));
    }
}));
exports.resetPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const hashedToken = crypto_1.default
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
    const user = yield user_model_1.default.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    if (!user) {
        return next(new AppError_1.default(400, 'Token is invalid or has expired'));
    }
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    yield user.save();
    (0, auth_utils_1.createAndSendToken)(user, res);
}));
