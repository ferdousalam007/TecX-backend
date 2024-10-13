import { Request, Response, NextFunction } from 'express';
import AppError from '../errors/AppError';

interface DatabaseError extends Error {
  path?: string;
  value?: unknown;
  code?: number;
  errmsg?: string;
  errors?: Record<string, { message: string }>;
}

const handleCastErrorDB = (err: DatabaseError): AppError => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(400, message);
};

const handleDuplicateFieldsDB = (err: DatabaseError): AppError => {
  const value = err.errmsg?.match(/(["'])(\\?.)*?\1/)?.[0] || '';
  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(400, message);
};

const handleValidationErrorDB = (err: DatabaseError): AppError => {
  const errors = Object.values(err.errors || {}).map((el) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(400, message);
};

const handleJWTError = (): AppError =>
  new AppError(401, 'Invalid token. Please log in again!');

const handleJWTExpiredError = (): AppError =>
  new AppError(401, 'Your token has expired! Please log in again.');

const sendErrorDev = (err: AppError, req: Request, res: Response): void => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err: AppError, req: Request, res: Response): void => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('ERROR ', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

export default function globalErrorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
  next: NextFunction,
): void {
  const appError =
    err instanceof AppError ? err : new AppError(500, err.message);

  appError.statusCode = appError.statusCode || 500;
  appError.status = appError.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(appError, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error: AppError = { ...appError };
    error.message = err.message;

    if (err instanceof Error) {
      if (err.name === 'CastError')
        error = handleCastErrorDB(err as DatabaseError);
      if (err.name === 'ValidationError')
        error = handleValidationErrorDB(err as DatabaseError);
      if (err.name === 'JsonWebTokenError') error = handleJWTError();
      if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();
    }

    if ('code' in err && err.code === 11000) {
      error = handleDuplicateFieldsDB(err as DatabaseError);
    }

    sendErrorProd(error, req, res);
  }
}
