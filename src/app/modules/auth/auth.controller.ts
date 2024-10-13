import httpStatus from 'http-status';
import crypto from 'crypto';
import catchAsync from '../../utils/catchAsync';
import User from '../user/user.model';
import AppError from '../../errors/AppError';
import { createAndSendToken } from './auth.utils';
import { RequestHandler } from 'express';
import Email from '../../utils/email';

// Destructure important variables from the config

// Route handler for user signup
export const signup = catchAsync(async (req, res) => {
  // Create a new user with the provided data
  const newUser = await User.create(req.body);
  // Generate JWT & Send token
  return createAndSendToken(newUser, res);
});

// Route handler for user signin
export const signin = catchAsync(async (req, res, next) => {
  // Extract email and password from the request body
  const { email, password } = req.body;

  // Find user by email and select password
  const user = await User.findOne({ email }).select('+password');

  // If user not found, return an error
  if (!user) return next(new AppError(httpStatus.NOT_FOUND, 'User not found'));

  if (user.isBlocked) {
    return next(
      new AppError(httpStatus.FORBIDDEN, 'Your account has been blocked'),
    );
  }

  // Check if the provided password matches the stored password
  const isPasswordMatched = await User.isPasswordMatched(
    password,
    user.password,
  );
  if (!isPasswordMatched) {
    // If passwords don't match, return an error
    return next(
      new AppError(httpStatus.UNAUTHORIZED, 'Incorrect email or password'),
    );
  }

  // Update loggedInAt field to the current date and time
  user.loggedInAt = new Date();
  await user.save({ validateBeforeSave: false }); // Save the updated user without running validation

  // Generate JWT & Send token
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

// Forgot Password route controller
export const forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get the user based on the POSTed email
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new AppError(
        httpStatus.NOT_FOUND,
        'No user found with this email address',
      ),
    );
  }

  // 2) Generate a random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  try {
    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;
    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch(error) {
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

// Reset Password route controller
export const resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get the user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If the token is valid and has not expired, set the new password
  if (!user) {
    return next(new AppError(400, 'Token is invalid or has expired'));
  }

  // 3) Update the changedPasswordAt property for the user
  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  // 4) Log the user in and send the JWT
  await user.save();
  createAndSendToken(user, res);
});
