"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAndSendToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../../config"));
const http_status_1 = __importDefault(require("http-status"));
const createAndSendToken = (user, res) => {
    // Prepare JWT payload
    const jwtPayload = {
        userId: user._id,
        role: user.role,
    };
    const token = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.JWT_SECRET, {
        expiresIn: config_1.default.JWT_EXPIRES_IN,
    });
    // Configure options for JWT cookie
    const cookieOptions = {
        expires: new Date(Date.now() +
            parseInt(config_1.default.JWT_COOKIE_EXPIRES_IN) * 24 * 60 * 60 * 1000),
        httpOnly: true,
        secure: config_1.default.NODE_ENV === 'production',
    };
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const { password: _ } = user, userData = __rest(user, ["password"]);
    // Set JWT token as a cookie in the response
    res.cookie('jwt', token, cookieOptions);
    // Send success response with user data and token
    res.status(http_status_1.default.OK).json({
        success: true,
        statusCode: http_status_1.default.OK,
        message: 'User logged in successfully',
        data: userData,
        token,
    });
};
exports.createAndSendToken = createAndSendToken;
