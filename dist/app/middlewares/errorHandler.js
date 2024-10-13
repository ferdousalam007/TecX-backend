"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../errors/AppError"));
const handleCastErrorDB = (err) => {
    const message = `Invalid ${err.path}: ${err.value}.`;
    return new AppError_1.default(400, message);
};
const handleDuplicateFieldsDB = (err) => {
    var _a, _b;
    const value = ((_b = (_a = err.errmsg) === null || _a === void 0 ? void 0 : _a.match(/(["'])(\\?.)*?\1/)) === null || _b === void 0 ? void 0 : _b[0]) || '';
    const message = `Duplicate field value: ${value}. Please use another value!`;
    return new AppError_1.default(400, message);
};
const handleValidationErrorDB = (err) => {
    const errors = Object.values(err.errors || {}).map((el) => el.message);
    const message = `Invalid input data. ${errors.join('. ')}`;
    return new AppError_1.default(400, message);
};
const handleJWTError = () => new AppError_1.default(401, 'Invalid token. Please log in again!');
const handleJWTExpiredError = () => new AppError_1.default(401, 'Your token has expired! Please log in again.');
const sendErrorDev = (err, req, res) => {
    res.status(err.statusCode).json({
        status: err.status,
        error: err,
        message: err.message,
        stack: err.stack,
    });
};
const sendErrorProd = (err, req, res) => {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
        });
    }
    else {
        console.error('ERROR ', err);
        res.status(500).json({
            status: 'error',
            message: 'Something went very wrong!',
        });
    }
};
function globalErrorHandler(err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
next) {
    const appError = err instanceof AppError_1.default ? err : new AppError_1.default(500, err.message);
    appError.statusCode = appError.statusCode || 500;
    appError.status = appError.status || 'error';
    if (process.env.NODE_ENV === 'development') {
        sendErrorDev(appError, req, res);
    }
    else if (process.env.NODE_ENV === 'production') {
        let error = Object.assign({}, appError);
        error.message = err.message;
        if (err instanceof Error) {
            if (err.name === 'CastError')
                error = handleCastErrorDB(err);
            if (err.name === 'ValidationError')
                error = handleValidationErrorDB(err);
            if (err.name === 'JsonWebTokenError')
                error = handleJWTError();
            if (err.name === 'TokenExpiredError')
                error = handleJWTExpiredError();
        }
        if ('code' in err && err.code === 11000) {
            error = handleDuplicateFieldsDB(err);
        }
        sendErrorProd(error, req, res);
    }
}
exports.default = globalErrorHandler;
