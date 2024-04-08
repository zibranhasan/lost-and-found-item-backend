"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewares/globalErrorHandler"));
const auth_routes_1 = require("./app/modules/Auth/auth.routes");
const Found_item_categories_routes_1 = require("./app/modules/Found-item-categories/Found-item-categories.routes");
const found_Item_routes_1 = require("./app/modules/Found-Item/found-Item.routes");
const claim_route_1 = require("./app/modules/Claim/claim.route");
const user_routes_1 = require("./app/modules/User/user.routes");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use("/api", auth_routes_1.AuthRoutes);
app.use("/api", Found_item_categories_routes_1.FoundItemCategoryRoutes);
app.use("/api", found_Item_routes_1.FoundItemsRoutes);
app.use("/api", claim_route_1.ClaimRoutes);
app.use("/api", user_routes_1.userRoutes);
app.use(globalErrorHandler_1.default);
app.get("/", (req, res) => {
    res.send({
        Message: "Lost and Found System............",
    });
});
exports.default = app;
