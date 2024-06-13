import express from "express";
import { foundItemCategoriesController } from "./Found-item-categories.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { foundItemCategoryValidation } from "./found-item-categories.validation";

const router = express.Router();

router.post(
  "/found-item-categories",
  auth(),
  validateRequest(foundItemCategoryValidation.createFoundItemCategorySchema),
  foundItemCategoriesController.foundItemCategories
);
router.get(
  "/found-item-categories",
  auth(),
  foundItemCategoriesController.getAllFoundItemCategories
);

export const FoundItemCategoryRoutes = router;
