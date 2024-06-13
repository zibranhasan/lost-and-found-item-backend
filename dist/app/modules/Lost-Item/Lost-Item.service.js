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
exports.lostItemService = void 0;
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const getCategoryIdByName = (categoryName) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield prisma_1.default.foundItemCategory.findFirst({
        where: { name: categoryName },
    });
    return category ? category.id : null;
});
const getOrCreateCategory = (categoryName) => __awaiter(void 0, void 0, void 0, function* () {
    let category = yield prisma_1.default.foundItemCategory.findFirst({
        where: { name: categoryName },
    });
    if (!category) {
        category = yield prisma_1.default.foundItemCategory.create({
            data: { name: categoryName },
        });
    }
    return category.id;
});
const createLostItem = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId, categoryName, name, description, location } = data;
    try {
        // Get or create the category
        const categoryId = yield getOrCreateCategory(categoryName);
        // Create the lost item with the retrieved/created category ID
        const newLostItem = yield prisma_1.default.lostItem.create({
            data: {
                userId,
                categoryId,
                name,
                description,
                location,
            },
        });
        return newLostItem;
    }
    catch (error) {
        throw new Error("Could not create lost item");
    }
});
const fetchRecentLostItems = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const recentLostItems = yield prisma_1.default.lostItem.findMany({
            orderBy: {
                createdAt: "desc",
            },
            take: 10, // Change the number of items to fetch as per requirement
        });
        return recentLostItems;
    }
    catch (error) {
        throw new Error("Could not fetch recent lost items");
    }
});
const fetchUserLostItems = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userLostItems = yield prisma_1.default.lostItem.findMany({
            where: {
                userId,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return userLostItems;
    }
    catch (error) {
        throw new Error("Could not fetch lost items for the user");
    }
});
const getLostItemById = (lostId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const lostItem = yield prisma_1.default.lostItem.findUnique({
            where: { id: lostId },
            include: {
                category: true,
                user: true, // Include the related category information
            },
        });
        return lostItem;
    }
    catch (error) {
        throw new Error("Could not retrieve lost item");
    }
});
const getMyLostItems = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find the user by email
        const user = yield prisma_1.default.user.findUnique({
            where: {
                email,
            },
        });
        if (!user) {
            throw new Error("User not found");
        }
        const userId = user.id;
        // Retrieve lost items associated with the user ID
        const lostItems = yield prisma_1.default.lostItem.findMany({
            where: {
                userId,
            },
            include: {
                category: true,
            },
        });
        return lostItems;
    }
    catch (error) {
        console.error("Error retrieving lost items:", error);
        throw error;
    }
});
const getRecentLostItemsWithFiltering = (filters) => __awaiter(void 0, void 0, void 0, function* () {
    const { category, location, keyword } = filters;
    try {
        const where = {};
        if (category) {
            const categoryId = yield getCategoryIdByName(category);
            if (categoryId) {
                where.categoryId = categoryId;
            }
        }
        if (location) {
            where.location = {
                contains: location,
                mode: "insensitive",
            };
        }
        if (keyword) {
            where.description = {
                contains: keyword,
                mode: "insensitive",
            };
        }
        const lostItems = yield prisma_1.default.lostItem.findMany({
            where,
            orderBy: {
                createdAt: "desc",
            },
            include: {
                category: true,
            },
        });
        return lostItems;
    }
    catch (error) {
        throw new Error("Could not fetch filtered lost items");
    }
});
exports.lostItemService = {
    createLostItem,
    fetchRecentLostItems,
    fetchUserLostItems,
    getLostItemById,
    getMyLostItems,
    getRecentLostItemsWithFiltering,
};
