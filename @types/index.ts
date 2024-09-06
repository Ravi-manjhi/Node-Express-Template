import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export interface IUser {
  username: string;
  role: string;
  email: string;
  id: string;
}
