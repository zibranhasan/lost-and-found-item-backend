import express from "express";

import auth from "../../middlewares/auth";
import { userController } from "./user.controller";
import validateRequest from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";

const router = express.Router();

router.get("/my-profile", auth(), userController.getProfileFromDB);
router.put(
  "/UpdateMy-profile",
  auth(),
  validateRequest(userValidation.userUpdateSchema),
  userController.updateUserProfileFromDB
);
router.get("/users", userController.getAllUsers);

export const userRoutes = router;
