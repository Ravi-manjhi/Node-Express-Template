import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as middleware from "./middlewares";
import { morganStream } from "./lib/winstonLogger";
import globalRouter from "./routes";

// initialization
const app = express();

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(cookieParser());
app.use(morgan("dev", { stream: morganStream }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ limit: "2mb", extended: false }));

//router api
app.use("/v1", globalRouter);

// error handler
app.all("*", middleware.undefinedRouteHandler);
app.use(middleware.globalErrorHandler);

export default app;
