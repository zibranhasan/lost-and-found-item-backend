import express from "express";
import auth from "../../middlewares/auth";
import { lostItemController } from "./Lost-Item.controller";

const router = express.Router();

router.post("/lost-items", auth(), lostItemController.createLostItem);
router.get("/lost-items/recent", lostItemController.getRecentLostItems);
router.get(
  "/lost-itemsWithFiltering",
  lostItemController.getRecentLostItemsWithFilteringController
);
router.get("/lost-items/:lostId", auth(), lostItemController.getLostItemById);
router.get("/lost-items/user", auth(), lostItemController.getUserLostItems);
router.get("/my-lost-items", auth(), lostItemController.getMyLostItems);

export const LostItemsRoutes = router;
