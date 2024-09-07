import { Request, Response, NextFunction } from "express";
import { catchAsyncError } from "../middlewares";
import AppError from "../lib/AppError";
import prisma from "../lib/PrismaClient";
import bcrypt from "bcrypt";

const SALT = parseInt(process.env.SALT as string);
if (!SALT) throw new Error("No SALT IN ENV");

export const getAllUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const users = await prisma.users.findMany({
      select: { id: true, email: true, role: true, createdAt: true },
    });

    if (!users.length) {
      return next(new AppError("No User Found", 404));
    }

    res.status(200).json(users);
  }
);

export const getUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    if (!id) {
      return next(new AppError("Id not Found in params", 404, "Bad Request"));
    }

    const user = await prisma.users.findUnique({
      where: { id },
      select: {
        username: true,
        id: true,
        email: true,
        updatedAt: true,
        avatar: true,
      },
    });

    res.status(200).json(user);
  }
);

export const updateUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params?.id;
    const { username, email, password, avatar } = req.body;

    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, SALT);
    }

    const updatedUser = await prisma.users.update({
      where: { id },
      data: { username, email, password: hashedPassword, avatar },
      select: {
        username: true,
        id: true,
        email: true,
        updatedAt: true,
        avatar: true,
      },
    });

    return res.status(200).json({ message: "updated", user: updatedUser });
  }
);

export const deleteUser = catchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params?.id;

    await prisma.users.delete({
      where: { id },
    });

    return res.status(204).json({ message: "updated" });
  }
);
