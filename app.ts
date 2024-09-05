import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import * as middleware from "./middlewares";
import { morganStream } from "./lib/winstonLogger";

// initialization
const app = express();

app.use(cors());
app.use(morgan("dev", { stream: morganStream }));
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ limit: "2mb", extended: false }));

// error handler
app.use("*", middleware.undefinedRouteHandler);
app.use(middleware.globalErrorHandler);

export default app;
