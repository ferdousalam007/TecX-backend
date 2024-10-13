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
const email_1 = __importDefault(require("../../utils/email"));
// Destructure important variables from the config
// Route handler for user signup
exports.signup = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Create a new user with the provided data
    const newUser = yield user_model_1.default.create(req.body);
    // Generate JWT & Send token
    return (0, auth_utils_1.createAndSendToken)(newUser, res);
}));
// Route handler for user signin
exports.signin = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // Extract email and password from the request body
    const { email, password } = req.body;
    // Find user by email and select password
    const user = yield user_model_1.default.findOne({ email }).select('+password');
    // If user not found, return an error
    if (!user)
        return next(new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not found'));
    if (user.isBlocked) {
        return next(new AppError_1.default(http_status_1.default.FORBIDDEN, 'Your account has been blocked'));
    }
    // Check if the provided password matches the stored password
    const isPasswordMatched = yield user_model_1.default.isPasswordMatched(password, user.password);
    if (!isPasswordMatched) {
        // If passwords don't match, return an error
        return next(new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Incorrect email or password'));
    }
    // Update loggedInAt field to the current date and time
    user.loggedInAt = new Date();
    yield user.save({ validateBeforeSave: false }); // Save the updated user without running validation
    // Generate JWT & Send token
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
// Forgot Password route controller
exports.forgotPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Get the user based on the POSTed email
    const user = yield user_model_1.default.findOne({ email: req.body.email });
    if (!user) {
        return next(new AppError_1.default(http_status_1.default.NOT_FOUND, 'No user found with this email address'));
    }
    // 2) Generate a random reset token
    const resetToken = user.createPasswordResetToken();
    yield user.save({ validateBeforeSave: false });
    try {
        const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
        yield new email_1.default(user, resetURL).sendPasswordReset();
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
// Reset Password route controller
exports.resetPassword = (0, catchAsync_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    // 1) Get the user based on the token
    const hashedToken = crypto_1.default
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');
    const user = yield user_model_1.default.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
    });
    // 2) If the token is valid and has not expired, set the new password
    if (!user) {
        return next(new AppError_1.default(400, 'Token is invalid or has expired'));
    }
    // 3) Update the changedPasswordAt property for the user
    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    // 4) Log the user in and send the JWT
    yield user.save();
    (0, auth_utils_1.createAndSendToken)(user, res);
}));
