"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoundItemCategoryRoutes = void 0;
const express_1 = __importDefault(require("express"));
const Found_item_categories_controller_1 = require("./Found-item-categories.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const found_item_categories_validation_1 = require("./found-item-categories.validation");
const router = express_1.default.Router();
router.post("/found-item-categories", (0, auth_1.default)(), (0, validateRequest_1.default)(found_item_categories_validation_1.foundItemCategoryValidation.createFoundItemCategorySchema), Found_item_categories_controller_1.foundItemCategoriesController.foundItemCategories);
router.get("/found-item-categories", (0, auth_1.default)(), Found_item_categories_controller_1.foundItemCategoriesController.getAllFoundItemCategories);
exports.FoundItemCategoryRoutes = router;
