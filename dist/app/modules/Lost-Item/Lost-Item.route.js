"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LostItemsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../../middlewares/auth"));
const Lost_Item_controller_1 = require("./Lost-Item.controller");
const router = express_1.default.Router();
router.post("/lost-items", (0, auth_1.default)(), Lost_Item_controller_1.lostItemController.createLostItem);
router.get("/lost-items/recent", Lost_Item_controller_1.lostItemController.getRecentLostItems);
router.get("/lost-itemsWithFiltering", Lost_Item_controller_1.lostItemController.getRecentLostItemsWithFilteringController);
router.get("/lost-items/:lostId", (0, auth_1.default)(), Lost_Item_controller_1.lostItemController.getLostItemById);
router.get("/lost-items/user", (0, auth_1.default)(), Lost_Item_controller_1.lostItemController.getUserLostItems);
router.get("/my-lost-items", (0, auth_1.default)(), Lost_Item_controller_1.lostItemController.getMyLostItems);
exports.LostItemsRoutes = router;
