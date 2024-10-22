import httpStatus from 'http-status';
import crypto from 'crypto';
import catchAsync from '../../utils/catchAsync';
import User from '../user/user.model';
import AppError from '../../errors/AppError';
import { createAndSendToken } from './auth.utils';
import { RequestHandler } from 'express';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

export const signup = catchAsync(async (req, res, next) => {
  const existingUser = await User.findOne({
    email: req.body.email,
    isDeleted: false,
  });
  if (existingUser) {
    return next(
      new AppError(httpStatus.CONFLICT, 'User already exists with this email'),
    );
  }

  const newUser = await User.create(req.body);

  return createAndSendToken(newUser, res);
});

export const signin = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  const isEmail = await User.findOne({ email, isDeleted: false });
  if (!isEmail) {
    return next(
      new AppError(httpStatus.UNAUTHORIZED, 'Incorrect email or password'),
    );
  }

  const user = await User.findOne({ email, isDeleted: false }).select(
    '+password',
  );

  if (!user) return next(new AppError(httpStatus.NOT_FOUND, 'User not found'));

  if (user.isBlocked) {
    return next(
      new AppError(httpStatus.FORBIDDEN, 'Your account has been blocked'),
    );
  }

  const isPasswordMatched = await User.isPasswordMatched(
    password,
    user.password,
  );
  if (!isPasswordMatched) {
    return next(
      new AppError(httpStatus.UNAUTHORIZED, 'Incorrect email or password'),
    );
  }

  user.loggedInAt = new Date();
  await user.save({ validateBeforeSave: false });

  return createAndSendToken(user, res);
});

export const logout: RequestHandler = (req, res) => {
  res.cookie('jwt', null, {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({
    status: 'success',
  });
};

export const forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({
    email: req.body.email,
    isDeleted: false,
    isBlocked: false,
  });
  if (!user) {
    return next(
      new AppError(
        httpStatus.NOT_FOUND,
        'No user found with this email address or account is blocked',
      ),
    );
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  try {
    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    // eslint-disable-next-line prefer-const
    const transporter = nodemailer.createTransport({
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
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.response);
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (error) {
    console.log(error);

    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new AppError(
        500,
        'There was an error sending the email. Please try again later!',
      ),
    );
  }
});

export const resetPassword = catchAsync(async (req, res, next) => {
 
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError(400, 'Token is invalid or has expired'));
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();
  createAndSendToken(user, res);
});
