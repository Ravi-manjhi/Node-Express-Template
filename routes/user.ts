import { Router } from "express";
import * as controller from "../controllers";
import * as auth from "../middlewares";

const router = Router();

router.route("/").get(auth.authorization(["user"]), controller.getAllUser);

router
  .route("/:id")
  .get(auth.authorizationSame, controller.getUser)
  .patch(auth.authorizationSame, controller.updateUser)
  .delete(auth.authorizationSame, controller.deleteUser);

export default router;
