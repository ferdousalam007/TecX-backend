import { NextFunction, Request, RequestHandler, Response } from 'express';

//Wraps an asynchronous request handler to catch errors and pass them to the next middleware.
const catchAsync = (fn: RequestHandler): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

export default catchAsync;
