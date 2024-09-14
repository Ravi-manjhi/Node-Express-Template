import { Schema, model } from 'mongoose';
import { IUser } from '../@types';
import bcrypt from 'bcrypt';
import { generateVerificationToken } from '../utils/createTokens';
import crypto from 'node:crypto';
import jwt from 'jsonwebtoken';

const SALT = parseInt(process.env.SALT as string);

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    name: { type: String, required: true },
    lastLogin: { type: Date, default: Date.now() },
    isVerified: { type: Boolean, default: false },
    resetPasswordToken: String,
    resetPasswordTokenExpiredAt: Date,
    verificationToken: String,
    verificationTokenExpiredAt: Date,
  },
  { timestamps: true },
);

userSchema.pre('save', async function (next) {
  const user = this as IUser;
  if (!user.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(SALT);
  const hash = await bcrypt.hash(user.password, salt);
  user.password = hash;

  if (!this.isVerified) {
    user.verificationToken = generateVerificationToken();
    user.verificationTokenExpiredAt = new Date(Date.now() + 60 * 60 * 1000);
  }

  next();
});

userSchema.methods.checkPassword = async function (textPassword: string) {
  return await bcrypt.compare(textPassword, this.password);
};

userSchema.methods.AccessToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_ACCESS_TOKEN as string, {
    expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRE as string,
  });
};

userSchema.methods.RefreshToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_REFRESH_TOKEN as string, {
    expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRE as string,
  });
};

userSchema.methods.createForgotToken = async function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = resetToken;
  this.resetPasswordTokenExpiredAt = new Date(Date.now() + 60 * 60 * 1000);
  this.save();
  return resetToken;
};

const userModel = model<IUser>('User', userSchema);

export default userModel;
