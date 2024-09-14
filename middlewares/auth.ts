import { Request, Response, NextFunction } from 'express';
import CatchAsyncError from '../utils/catchAsyncError';
import AppError from '../utils/AppError';
import { verifyToken } from '../utils/createTokens';
import userModel from '../models/auth';

export const authenticated = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { refresh_token } = req.cookies;

  if (!refresh_token) return next(new AppError('Login to continue', 401, 'Unauthorized '));

  const token = verifyToken(process.env.JWT_REFRESH_TOKEN as string, refresh_token);
  const user = await userModel.findById(token.id).lean();
  if (!user) return next(new AppError('No Authorized', 401, 'Unauthorized'));

  req.user = { ...user };
  next();
});
