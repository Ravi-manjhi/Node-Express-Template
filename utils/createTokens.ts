import { Response } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../lib/logger';
import { IDecodedPayload, IUser } from '../@types';

export const generateVerificationToken = () => {
  return Math.floor(10000 + Math.random() * 900000).toString();
};

export const generateTokenAndSetCookie = (res: Response, userId: string) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRE as string,
  });

  logger.info('sending verification token');
  res.cookie('verification_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'PRODUCTION',
    sameSite: 'strict',
    maxAge: 60 * 60 * 1000,
  });

  return token;
};

export function generateAccessTokenAndSetCookie(res: Response, user: IUser) {
  logger.info('sending access token');

  const token = user.AccessToken();

  res.cookie('access_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'PRODUCTION',
    sameSite: 'strict',
    maxAge: 15 * 60 * 1000,
  });
}

export function generateRefreshTokenAndSetCookie(res: Response, user: IUser) {
  logger.info('sending refresh token');
  const token = user.RefreshToken();
  res.cookie('refresh_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'PRODUCTION',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
}

export const verifyToken = (secret: string, payload: string) => {
  return jwt.verify(payload, secret) as IDecodedPayload;
};
