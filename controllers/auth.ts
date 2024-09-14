import { Request, Response, NextFunction } from 'express';
import {
  generateAccessTokenAndSetCookie,
  generateRefreshTokenAndSetCookie,
  generateTokenAndSetCookie,
  verifyToken,
} from '../utils/createTokens';
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from '../lib/nodemailer/emails';
import CatchAsyncError from '../utils/catchAsyncError';
import AppError from '../utils/AppError';
import userModel from '../models/auth';
import { IDecodedPayload } from '../@types';

// login
export const signIn = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { password, email } = req.body;
  if (!email || !password) {
    return next(new AppError('Email or password missing', 404, 'Credentials missing'));
  }

  const user = await userModel.findOne({ email }).select('+password ');

  if (!user || !(await user.checkPassword(password))) {
    return next(new AppError('Email or password wrong', 401, 'unauthorized'));
  }

  generateRefreshTokenAndSetCookie(res, user);
  generateAccessTokenAndSetCookie(res, user);

  const userResponse = {
    ...user.toObject(),
    password: undefined,
    resetPasswordToken: undefined,
    resetPasswordTokenExpiredAt: undefined,
    verificationToken: undefined,
    verificationTokenExpiredAt: undefined,
    __v: undefined,
  };

  user.lastLogin = new Date(Date.now());
  user.save();

  res.status(200).json({ message: 'authenticated', user: userResponse });
});

// signup
export const signUP = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(new AppError('Email, password, or name missing', 400, 'Credentials missing'));
  }

  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    return next(new AppError('Email already in use', 409, 'Duplicate email'));
  }

  const newUser = await userModel.create({ name, email, password });
  if (newUser?.verificationToken) {
    await sendVerificationEmail(email, newUser?.verificationToken);
  }

  generateTokenAndSetCookie(res, newUser._id);

  res.status(201).json({ message: 'Created', suggestion: 'Please verify using auth/verify-email' });
});

// verify Email
export const verifyEmail = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { code } = req.body;
  const { verification_token } = req.cookies;
  const payload = verifyToken(process.env.JWT_SECRET as string, verification_token) as IDecodedPayload;

  const user = await userModel
    .findOne({
      _id: payload.id,
      verificationToken: code,
      verificationTokenExpiredAt: { $gt: Date.now() },
    })
    .select('-updatedAt -createdAt -__v');

  if (!user) {
    return next(new AppError('Code expired or invalid', 403, 'Bad Request'));
  }

  res.clearCookie('verification_token');
  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpiredAt = undefined;

  await sendWelcomeEmail(user.email, user.name);

  generateRefreshTokenAndSetCookie(res, user);
  generateAccessTokenAndSetCookie(res, user);

  user.save();
  res.status(200).json({ message: 'Verified', user });
});

// forgot password
export const forgotPassword = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { email } = req.body;

  if (!email) {
    return next(new AppError('Email  missing', 404, 'Credentials missing'));
  }

  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new AppError('Account not found', 404, 'Not found'));
  }

  const resetToken = await user.createForgotToken();
  await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);
  res.status(200).json({ message: 'reset Token send to email' });
});

// restPassword
export const resetPassword = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  const { token } = req.params;
  const { password, confirmPassword } = req.body;

  if (!token) return next(new AppError('Credentials are missing or Password not match', 404, 'TokenMission'));
  if (!password || !confirmPassword || !password === confirmPassword)
    return next(new AppError('Password provided or Password not match', 400, 'Bad Request'));

  const user = await userModel
    .findOne({
      resetPasswordToken: token,
      resetPasswordTokenExpiredAt: { $gt: new Date(Date.now()) },
    })
    .select('+password');
  if (!user) return next(new AppError('Token expired or Invalid', 403, 'Not Authorized'));

  if (await user.checkPassword(password))
    return next(new AppError('Please User different Password', 403, 'Not Allowed'));

  await sendResetSuccessEmail(user.email);
  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpiredAt = undefined;

  await user.save();
  res.status(200).json({ message: 'password change successfully! please login' });
});

// logout
export const signOut = (_req: Request, res: Response) => {
  res.clearCookie('refresh_token');
  res.clearCookie('access_token');
  res.status(200).json('Logout Success');
};

// me
export const checkMe = (req: Request, res: Response, next: NextFunction) => {
  const { user } = req;

  if (!user) {
    return next(new AppError('Please Login to Continue...', 401, 'unauthorized'));
  }

  return res.status(200).json({ message: 'Authorized', user });
};
