import { Router } from "express";
import authRouter from "./auth";
import userRouter from "./user";
import * as auth from "../middlewares";

const router = Router();

// open
router.use("/auth", authRouter);

// authenticated user only fetch this middleware protected
router.use(auth.authenticated);
router.use("/users", userRouter);

export default router;
