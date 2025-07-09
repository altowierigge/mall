import { Request, Response, NextFunction } from 'express';
import { ApiResponseUtil } from '../utils/response';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err);

  // Default to 500 server error
  let statusCode = 500;
  let message = 'Internal Server Error';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = 'Validation Error';
  } else if (err.name === 'UnauthorizedError') {
    statusCode = 401;
    message = 'Unauthorized';
  } else if (err.name === 'NotFoundError') {
    statusCode = 404;
    message = 'Not Found';
  }

  ApiResponseUtil.error(res, message, statusCode);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  ApiResponseUtil.notFound(res, `Route ${req.method} ${req.path} not found`);
};