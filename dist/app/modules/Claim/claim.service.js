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
exports.ClaimServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createClaim = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, foundItemId, distinguishingFeatures, lostDate } = data;
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
        // Check if the found item exists
        const foundItem = yield prisma_1.default.foundItem.findUnique({
            where: {
                id: foundItemId,
            },
        });
        if (!foundItem) {
            throw new ApiError_1.default(http_status_codes_1.default.NOT_FOUND, "Found item not found");
        }
        // Create the claim
        const createdClaim = yield prisma_1.default.claim.create({
            data: {
                userId,
                foundItemId,
                distinguishingFeatures,
                lostDate,
                status: "PENDING",
            },
        });
        return createdClaim;
    }
    catch (error) {
        // Handle any errors
        console.error("Error creating claim:", error);
        throw error; // Re-throw the error to be handled by the caller
    }
});
const getClaims = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield prisma_1.default.claim.findMany({
            include: {
                foundItem: {
                    include: {
                        user: true,
                        category: true,
                    },
                },
            },
        });
        const formattedClaims = result.map((claim) => {
            const { id, userId, foundItemId: claimFoundItemId, // Rename the variable here
            distinguishingFeatures, lostDate, status, createdAt, updatedAt, foundItem: { id: foundItemId, userId: foundItemUserId, categoryId, foundItemName, description, location, createdAt: foundItemCreatedAt, updatedAt: foundItemUpdatedAt, user, category, }, } = claim;
            return {
                id,
                userId,
                foundItemId: claimFoundItemId,
                distinguishingFeatures,
                lostDate,
                status,
                createdAt,
                updatedAt,
                foundItem: {
                    id: foundItemId,
                    userId: foundItemUserId,
                    categoryId,
                    foundItemName,
                    description,
                    location,
                    createdAt: foundItemCreatedAt,
                    updatedAt: foundItemUpdatedAt,
                    user,
                    category,
                },
            };
        });
        return formattedClaims;
    }
    catch (error) { }
});
const updateClaimStatus = (claimId, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Update the claim status in the database
        const updatedClaim = yield prisma_1.default.claim.update({
            where: {
                id: claimId,
            },
            data: {
                status,
            },
            // Optionally include additional fields to be returned in the response
            select: {
                id: true,
                userId: true,
                foundItemId: true,
                distinguishingFeatures: true,
                lostDate: true,
                status: true,
                createdAt: true,
                updatedAt: true,
            },
        });
        return updatedClaim;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_codes_1.default.BAD_REQUEST, "There are issues updaeting claim");
    }
});
exports.ClaimServices = {
    createClaim,
    getClaims,
    updateClaimStatus,
};
