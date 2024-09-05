import { NextFunction, Request, Response, RequestHandler } from "express";
import AppError from "../lib/AppError";

const NODE_ENV = process.env.NODE_ENV;

type ErrorOBJ = {
  name: string;
  message: string;
  stack?: string;
};

interface CustomError extends Error {
  statusCode?: number;
}

export const catchAsyncError =
  (fn: RequestHandler) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

export const globalErrorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const message = err.message || "Internal Server Error";
  const statusCode = err.statusCode || 500;
  const name = err.name || "InternalServerError";

  const errObj: ErrorOBJ = { name, message };

  if (NODE_ENV === "PRODUCTION") {
    return res.status(statusCode).json(errObj);
  }

  errObj.stack = err.stack;
  console.error(errObj);
  res.status(statusCode).json(errObj);
};

export const undefinedRouteHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  next(new AppError(`${req.originalUrl}`, 404, "URL NOT Found"));
};
