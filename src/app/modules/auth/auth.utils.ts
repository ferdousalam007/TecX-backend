import jwt from 'jsonwebtoken';
import config from '../../config';
import httpStatus from 'http-status';
import { Response } from 'express';
import { TUser } from '../user/user.interface';
import { Types } from 'mongoose';

export const createAndSendToken = (
  user: TUser & {
    _id: Types.ObjectId;
  },
  res: Response,
) => {
  // Prepare JWT payload
  const jwtPayload = {
    userId: user._id,
    role: user.role,
  };
  const token = jwt.sign(jwtPayload, config.JWT_SECRET as string, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
  // Configure options for JWT cookie
  const cookieOptions = {
    expires: new Date(
      Date.now() +
        parseInt(config.JWT_COOKIE_EXPIRES_IN as string) * 24 * 60 * 60 * 1000,
    ),
    httpOnly: true,
    secure: config.NODE_ENV === 'production',
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  const { password: _, ...userData } = user;
  // Set JWT token as a cookie in the response
  res.cookie('jwt', token, cookieOptions);

  // Send success response with user data and token
  res.status(httpStatus.OK).json({
    success: true,
    statusCode: httpStatus.OK,
    message: 'User logged in successfully',
    data: userData,
    token,
  });
};
