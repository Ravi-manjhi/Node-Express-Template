import { Document } from 'mongoose';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: IUserPub;
    }
  }
}

interface IUserPub extends Document {
  email: string;
  password: string;
  name: string;
  lastLogin: Date;
  isVerified: boolean;
}

export interface IUser extends Document {
  _id: string;
  email: string;
  password: string;
  name: string;
  lastLogin: Date;
  isVerified: boolean;
  resetPasswordToken?: string;
  resetPasswordTokenExpiredAt?: Date;
  verificationToken?: string;
  verificationTokenExpiredAt?: Date;
  checkPassword(textPassword: string): Promise<boolean>;
  createForgotToken(): Promise<string>;
  AccessToken(): string;
  RefreshToken(): string;
}
