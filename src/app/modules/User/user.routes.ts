import express from "express";

import auth from "../../middlewares/auth";
import { userController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";

const router = express.Router();

router.get("/my-profile", auth(), userController.getProfileFromDB);
router.put(
  "/my-profile",
  auth(),
  validateRequest(userValidation.userUpdateSchema),
  userController.updateUserProfileFromDB
);

export const userRoutes = router;
