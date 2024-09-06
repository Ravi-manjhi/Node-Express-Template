import { Request, Response, NextFunction } from "express";
import { catchAsyncError } from "../middlewares";
import AppError from "../lib/AppError";
import prisma from "../lib/PrismaClient";
import bcrypt from "bcrypt";
import { createAccessToken, createRefreshToken } from "../lib/createToken";

const SALT = parseInt(process.env.SALT as string);
if (!SALT) throw new Error("No SALT IN ENV");

export const login = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, username, password } = req.body;
    const user = await prisma.users.findUnique({ where: { email, username } });

    if (!user || !(await bcrypt.compare(password, user?.password))) {
      return next(
        new AppError("Email or password are incorrect", 401, "Unauthorized")
      );
    }

    const filteredUser = { ...user, password: undefined };
    delete filteredUser.password;

    createAccessToken(res, { name: "Id", value: user.id });
    createRefreshToken(res, { name: "Id", value: user.id });

    res.status(200).json({ message: "authenticated", user: filteredUser });
  }
);

export const register = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return next(new AppError("credentials are missing", 403));
    }

    const hashedPass = await bcrypt.hash(password, SALT);

    const newUser = await prisma.users.create({
      data: { username, email, password: hashedPass },
    });

    res.status(201).json("created...");
  }
);

export const logout = (req: Request, res: Response) => {
  res.clearCookie("access_token");
  res.clearCookie("refresh_token");
  return res.status(200).json("logout Successful");
};

export const isLoggedIn = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (!user) {
    return next(new AppError("Session Expired", 401, "Unauthorized"));
  }

  res.status(200).json("Authorized");
};
