class AppError extends Error {
  public statusCode: number; // HTTP status code associated with the error
  public status: string; // status of the error: 'fail' or 'error'
  public isOperational: boolean; // Operational errors are known errors

  constructor(statusCode: number, message: string, stack = '') {
    super(message);

    this.message = message;
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor); // Capture stack trace only if stack is not provided
    }
  }
}

export default AppError;
