import express from "express";
import { AuthController } from "./auth.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post("/register", AuthController.register);

router.post("/login", AuthController.loginUser);

router.post("/change-password", auth(), AuthController.changePassword);
router.put("/users/status/:userId", AuthController.updateUserStatus);

export const AuthRoutes = router;
