import express from "express";
import auth from "../../middlewares/auth";
import { foundItemController } from "./found-Item.controller";
import validateRequest from "../../middlewares/validateRequest";
import { foundItemValidation } from "./found-item.validation";

const router = express.Router();

router.post(
  "/found-items",
  auth(),
  validateRequest(foundItemValidation.createFoundItemSchema),
  foundItemController.createfoundItem
);

router.get("/found-items", foundItemController.getAllFoundItemFromDB);

export const FoundItemsRoutes = router;
