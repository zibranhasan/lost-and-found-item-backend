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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FoundItemService = void 0;
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const foundItem_constant_1 = require("./foundItem.constant");
const createFoundItem = (user, bodyData) => __awaiter(void 0, void 0, void 0, function* () {
    const { categoryId, foundItemName, description, location } = bodyData;
    const { email } = user;
    try {
        // Retrieve the user ID using the email
        const existingUser = yield prisma_1.default.user.findFirst({
            where: {
                email,
            },
        });
        if (!existingUser) {
            throw new Error("User not found");
        }
        const { id: userId, name, email: userEmail, createdAt: userCreatedAt, updatedAt: userUpdatedAt, } = existingUser;
        // Retrieve the category details
        const category = yield prisma_1.default.foundItemCategory.findUnique({
            where: {
                id: categoryId,
            },
        });
        if (!category) {
            throw new Error("Category not found");
        }
        const { id: categoryIdResult, name: categoryName, createdAt: categoryCreatedAt, updatedAt: categoryUpdatedAt, } = category;
        // Create the found item
        const createdFoundItem = yield prisma_1.default.foundItem.create({
            data: {
                userId,
                categoryId: categoryIdResult,
                foundItemName,
                description,
                location,
            },
        });
        return {
            id: createdFoundItem.id,
            userId: createdFoundItem.userId,
            user: {
                id: userId,
                name,
                email: userEmail,
                createdAt: userCreatedAt.toISOString(),
                updatedAt: userUpdatedAt.toISOString(),
            },
            categoryId: createdFoundItem.categoryId,
            category: {
                id: categoryIdResult,
                name: categoryName,
                createdAt: categoryCreatedAt.toISOString(),
                updatedAt: categoryUpdatedAt.toISOString(),
            },
            foundItemName: createdFoundItem.foundItemName,
            description: createdFoundItem.description,
            location: createdFoundItem.location,
            createdAt: createdFoundItem.createdAt.toISOString(),
            updatedAt: createdFoundItem.updatedAt.toISOString(),
        };
    }
    catch (error) {
        console.error("Error creating found item:", error);
        throw error; // Re-throw the error to be handled by the caller
    }
});
const getAllFoundItemFromDB = (params, options) => __awaiter(void 0, void 0, void 0, function* () {
    const { page, limit, skip } = paginationHelper_1.paginationHelper.calculatePagination(options);
    const { searchTerm } = params, filterData = __rest(params, ["searchTerm"]);
    const andConditions = [];
    if (params.searchTerm) {
        andConditions.push({
            OR: foundItem_constant_1.foundItemSearchAbleFields.map((field) => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: "insensitive",
                },
            })),
        });
    }
    if (Object.keys(filterData).length > 0) {
        andConditions.push({
            AND: Object.keys(filterData).map((key) => ({
                [key]: {
                    equals: filterData[key],
                },
            })),
        });
    }
    const whereConditions = andConditions.length > 0 ? { AND: andConditions } : {};
    const foundItems = yield prisma_1.default.foundItem.findMany({
        where: whereConditions,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder
            ? {
                [options.sortBy]: options.sortOrder,
            }
            : {
                createdAt: "desc",
            },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true,
                },
            },
            category: {
                select: {
                    id: true,
                    name: true,
                    createdAt: true,
                    updatedAt: true,
                },
            },
        },
    });
    const total = yield prisma_1.default.foundItem.count({
        where: whereConditions,
    });
    const formattedFoundItems = foundItems.map((foundItem) => ({
        id: foundItem.id,
        foundItemName: foundItem.foundItemName,
        description: foundItem.description,
        location: foundItem.location,
        createdAt: foundItem.createdAt.toISOString(),
        updatedAt: foundItem.updatedAt.toISOString(),
        user: {
            id: foundItem.user.id,
            name: foundItem.user.name,
            email: foundItem.user.email,
            createdAt: foundItem.user.createdAt.toISOString(),
            updatedAt: foundItem.user.updatedAt.toISOString(),
        },
        category: {
            id: foundItem.category.id,
            name: foundItem.category.name,
            createdAt: foundItem.category.createdAt.toISOString(),
            updatedAt: foundItem.category.updatedAt.toISOString(),
        },
    }));
    return {
        meta: { total, page, limit },
        data: formattedFoundItems,
    };
});
exports.FoundItemService = {
    createFoundItem,
    getAllFoundItemFromDB,
};
