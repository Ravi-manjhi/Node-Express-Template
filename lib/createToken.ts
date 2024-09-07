import { Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const ACCESS_TOKEN = process.env.JWT_ACCESS_TOKEN as string;
const REFRESH_TOKEN = process.env.JWT_REFRESH_TOKEN as string;
const ACCESS_TOKEN_EXPIRE = process.env.JWT_ACCESS_TOKEN_EXPIRE as string;
const REFRESH_TOKEN_EXPIRE = process.env.JWT_REFRESH_TOKEN_EXPIRE as string;

export interface ITokenPayload extends JwtPayload {
  name: string;
  value: string;
}

export const createAccessToken = (
  res: Response,
  tokenPayload: ITokenPayload
) => {
  const token = jwt.sign(tokenPayload, ACCESS_TOKEN, {
    expiresIn: ACCESS_TOKEN_EXPIRE,
  });

  return res.cookie("access_token", token, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};

export const createRefreshToken = (
  res: Response,
  tokenPayload: ITokenPayload
) => {
  const token = jwt.sign(tokenPayload, REFRESH_TOKEN, {
    expiresIn: REFRESH_TOKEN_EXPIRE,
  });

  return res.cookie("refresh_token", token, {
    expires: new Date(Date.now() + 15 * 3600000),
    httpOnly: process.env.NODE_ENG === "DEVELOPMENT",
  });
};

export const decryptToken = (token: string, tokenType: string) => {
  const key = tokenType === "ACCESS_TOKEN" ? ACCESS_TOKEN : REFRESH_TOKEN;
  const decryptToken = jwt.verify(token, key);

  return decryptToken;
};
