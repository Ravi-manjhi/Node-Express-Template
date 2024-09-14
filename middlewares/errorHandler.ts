import { Request, Response, NextFunction } from 'express';
import AppError from '../utils/AppError';
import logger from '../lib/logger';

const NODE_ENV = process.env.NODE_ENV;

interface GlobalError extends Error {
  isOperational?: boolean;
  stack: string;
  statusCode?: number;
}

type ErrorObj = {
  name: string;
  message: string;
  isOperational: boolean;
  stack?: string;
};

export const undefinedRouterHandler = (req: Request, res: Response, next: NextFunction) => {
  const message = `${req.originalUrl} -- Not Defined`;
  return next(new AppError(message, 404, 'Not Found'));
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const GlobalErrorHandler = (err: GlobalError, req: Request, res: Response, next: NextFunction) => {
  const message = err.message;
  const name = err.name;
  const statusCode = err.statusCode ?? 500;

  //   Error logic here

  // err defined and send response
  const ErrorObj: ErrorObj = {
    name,
    message,
    isOperational: err.isOperational || false,
  };

  if (NODE_ENV === 'PRODUCTION') {
    return res.status(statusCode).json(ErrorObj);
  }

  ErrorObj.stack = err.stack;
  logger.error(ErrorObj);
  return res.status(statusCode).json(ErrorObj);
};

export default GlobalErrorHandler;
