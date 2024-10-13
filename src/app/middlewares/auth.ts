import { NextFunction, Request, Response } from 'express';
import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import config from '../config';
import { TUserRole } from '../modules/user/user.interface';
import User from '../modules/user/user.model';
import catchAsync from '../utils/catchAsync';

const sendUnauthorizedError = (res: Response) => {
  return res.status(httpStatus.UNAUTHORIZED).json({
    success: false,
    statusCode: httpStatus.UNAUTHORIZED,
    message: 'You have no access to this route',
  });
};
const auth = (...requiredRoles: TUserRole[]) => {
  return catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    // checking if the token is missing
    if (!token) return sendUnauthorizedError(res);

    // checking if the given token is valid
    const decoded = jwt.verify(
      token,
      config.JWT_SECRET as string,
    ) as JwtPayload;

    const { role, userId } = decoded;

    // checking if the user is exist
    const user = await User.findById(userId);

    if (!user) return sendUnauthorizedError(res);
    // checking if the user has the required role
    if (requiredRoles && !requiredRoles.includes(role))
      return sendUnauthorizedError(res);
    req.user = decoded as JwtPayload;
    next();
  });
};

export default auth;
