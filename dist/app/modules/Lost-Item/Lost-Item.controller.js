"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lostItemController = exports.getRecentLostItemsWithFilteringController = exports.getLostItemById = exports.getUserLostItems = exports.getRecentLostItems = exports.createLostItem = void 0;
const Lost_Item_service_1 = require("./Lost-Item.service");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const createLostItem = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, categoryName, name, description, location } = req.body;
        const newLostItem = yield Lost_Item_service_1.lostItemService.createLostItem({
            userId,
            categoryName,
            name,
            description,
            location,
        });
        res.status(201).json(newLostItem);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.createLostItem = createLostItem;
const getRecentLostItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recentLostItems = yield Lost_Item_service_1.lostItemService.fetchRecentLostItems();
        res.status(200).json({ data: recentLostItems });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getRecentLostItems = getRecentLostItems;
const getUserLostItems = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.user;
        // Retrieve the user ID using the email
        const existingUser = yield prisma_1.default.user.findFirst({
            where: {
                email,
            },
        });
        if (!existingUser) {
            throw new Error("User not found");
        }
        const { id: userId } = existingUser;
        const userLostItems = yield Lost_Item_service_1.lostItemService.fetchUserLostItems(userId);
        res.status(200).json(userLostItems);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getUserLostItems = getUserLostItems;
const getLostItemById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { lostId } = req.params;
        const lostItem = yield Lost_Item_service_1.lostItemService.getLostItemById(lostId);
        if (!lostItem) {
            return res.status(404).json({ error: "Lost item not found" });
        }
        res.status(200).json({ data: { lostItem } });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
});
exports.getLostItemById = getLostItemById;
const getMyLostItems = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userEmail = req.user.email;
        const lostItems = yield Lost_Item_service_1.lostItemService.getMyLostItems(userEmail);
        (0, sendResponse_1.default)(res, {
            statusCode: 202,
            success: true,
            message: "Lost items retrieved successfully!",
            data: lostItems,
        });
    }
    catch (error) {
        next(error);
    }
});
const getRecentLostItemsWithFilteringController = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { category, location, keyword } = req.query;
        const lostItems = yield Lost_Item_service_1.lostItemService.getRecentLostItemsWithFiltering({
            category: category === null || category === void 0 ? void 0 : category.toString(),
            location: location === null || location === void 0 ? void 0 : location.toString(),
            keyword: keyword === null || keyword === void 0 ? void 0 : keyword.toString(),
        });
        (0, sendResponse_1.default)(res, {
            statusCode: 200,
            success: true,
            message: "Filtered lost items fetched successfully",
            data: lostItems,
        });
    }
    catch (error) { }
});
exports.getRecentLostItemsWithFilteringController = getRecentLostItemsWithFilteringController;
exports.lostItemController = {
    createLostItem: exports.createLostItem,
    getRecentLostItems: exports.getRecentLostItems,
    getUserLostItems: exports.getUserLostItems,
    getLostItemById: exports.getLostItemById,
    getMyLostItems,
    getRecentLostItemsWithFilteringController: exports.getRecentLostItemsWithFilteringController,
};
