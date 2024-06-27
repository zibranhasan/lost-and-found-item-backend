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
router.get(
  "/found-itemsWithFiltering",
  foundItemController.getRecentFoundItemsWithFilteringController
);
router.get("/found-items/:foundId", foundItemController.getFoundItemById);
router.get("/found-items", foundItemController.getAllFoundItemFromDB);
router.get("/myFound-items", auth(), foundItemController.getFoundItems);

export const FoundItemsRoutes = router;
