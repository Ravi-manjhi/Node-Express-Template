import { Router } from "express";
import * as controller from "../controllers";
import * as auth from "../middlewares";

const router = Router();

router.post("/login", controller.login);
router.post("/register", controller.register);
router.get("/logout", controller.logout);
router.get("/logged", auth.authenticated, controller.isLoggedIn);

export default router;
