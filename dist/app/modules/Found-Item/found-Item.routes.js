"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoundItemsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const found_Item_controller_1 = require("./found-Item.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const found_item_validation_1 = require("./found-item.validation");
const router = express_1.default.Router();
router.post("/found-items", (0, auth_1.default)(), (0, validateRequest_1.default)(found_item_validation_1.foundItemValidation.createFoundItemSchema), found_Item_controller_1.foundItemController.createfoundItem);
router.get("/found-items", found_Item_controller_1.foundItemController.getAllFoundItemFromDB);
exports.FoundItemsRoutes = router;
