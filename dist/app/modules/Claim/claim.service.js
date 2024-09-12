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
    const { email, foundItemId, distinguishingFeatures, lostDate, verificationMethod, verificationDetails, contactInformation, } = data;
    const existingUser = yield prisma_1.default.user.findFirst({
        where: { email },
    });
    if (!existingUser) {
        throw new ApiError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const foundItem = yield prisma_1.default.foundItem.findUnique({
        where: { id: foundItemId },
    });
    if (!foundItem) {
        throw new ApiError_1.default(http_status_codes_1.default.NOT_FOUND, "Found item not found");
    }
    const createdClaim = yield prisma_1.default.claim.create({
        data: {
            userId: existingUser.id,
            foundItemId,
            distinguishingFeatures,
            lostDate,
            verificationMethod,
            verificationDetails,
            contactInformation,
            status: "PENDING",
        },
    });
    return createdClaim;
});
const getAllClaims = () => __awaiter(void 0, void 0, void 0, function* () {
    const claims = yield prisma_1.default.claim.findMany({
        include: {
            foundItem: {
                include: { user: true, category: true },
            },
        },
    });
    return claims;
});
const updateClaimFields = (claimId, data) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate if the claim exists before updating
    const existingClaim = yield prisma_1.default.claim.findUnique({
        where: { id: claimId },
    });
    if (!existingClaim) {
        throw new ApiError_1.default(http_status_codes_1.default.NOT_FOUND, "Claim not found");
    }
    // Update the claim with the provided data
    const updatedClaim = yield prisma_1.default.claim.update({
        where: { id: claimId },
        data, // This will update only the fields provided in `data`
    });
    return updatedClaim;
});
const getMyClaims = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.default.user.findUnique({
        where: { email },
    });
    if (!user) {
        throw new ApiError_1.default(http_status_codes_1.default.NOT_FOUND, "User not found");
    }
    const claims = yield prisma_1.default.claim.findMany({
        where: { userId: user.id },
        include: { foundItem: true },
    });
    return claims;
});
const deleteClaim = (claimId) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma_1.default.claim.delete({
        where: { id: claimId },
    });
});
exports.ClaimServices = {
    createClaim,
    getAllClaims,
    updateClaimFields,
    getMyClaims,
    deleteClaim,
};
