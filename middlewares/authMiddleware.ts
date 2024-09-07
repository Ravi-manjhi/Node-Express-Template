import { Request, Response, NextFunction } from "express";
import {
  createRefreshToken,
  decryptToken,
  ITokenPayload,
} from "../lib/createToken";
import { catchAsyncError } from "./errorHandler";
import { IUser } from "../@types";
import AppError from "../lib/AppError";
import prisma from "../lib/PrismaClient";
import logger from "../lib/winstonLogger";

// Middleware for authentication
export const authenticated = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { refresh_token, access_token } = req.cookies;

    logger.info("Checking User Info");

    // Check if tokens are present
    if (!refresh_token || !access_token) {
      ClearSession(req, res, next);
      return next(new AppError("Session Expired", 401, "Unauthorized"));
    }

    // Attempt to decrypt the tokens
    let accessPayload: ITokenPayload | null = null;
    let refreshPayload: ITokenPayload | null = null;

    try {
      accessPayload = decryptToken(
        access_token,
        "ACCESS_TOKEN"
      ) as ITokenPayload;
      refreshPayload = decryptToken(
        refresh_token,
        "REFRESH_TOKEN"
      ) as ITokenPayload;
    } catch (error) {
      logger.error("Token decryption failed", error);
      ClearSession(req, res, next);
      return next(new AppError("Invalid Tokens", 401, "Unauthorized"));
    }

    // Ensure both tokens contain the same value
    if (accessPayload.value !== refreshPayload.value) {
      ClearSession(req, res, next);
      return next(new AppError("Session Expired", 401, "Unauthorized"));
    }

    // Find the user in the database using the user ID from the token
    const user = await prisma.users.findUnique({
      where: { id: accessPayload.value },
      select: { username: true, email: true, role: true, id: true },
    });

    // If no user is found, clear the session
    if (!user) {
      ClearSession(req, res, next);
      return next(new AppError("Invalid Credentials", 401, "Unauthorized"));
    }

    // If valid, create a new refresh token and update the response cookies
    logger.info("Setting new Refresh token");
    createRefreshToken(res, { name: "Id", value: user.id });

    // Attach the user object to the request for further use
    req.user = user as IUser;
    next();
  }
);

// Middleware for role-based authorization
export const authorization = (allowedRoles: string[]) =>
  catchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    // If no user is logged in or their role is not allowed, throw an error
    if (!user || !allowedRoles.includes(user.role)) {
      return next(
        new AppError("Not Authorized to perform this task", 403, "Forbidden")
      );
    }

    // If role is authorized, proceed
    next();
  });

export const authorizationSame = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const id = req.params?.id;

    if (user?.id !== id) {
      return next(
        new AppError("Not Authorized to perform this task", 403, "Forbidden")
      );
    }

    next();
  }
);

// Utility to clear session cookies and reset user data
const ClearSession = (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  req.user = undefined;
  next();
};
