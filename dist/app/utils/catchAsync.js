"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//Wraps an asynchronous request handler to catch errors and pass them to the next middleware.
const catchAsync = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.default = catchAsync;
