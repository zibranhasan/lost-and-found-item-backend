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
exports.UserServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const getProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract user ID from the authenticated user
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
        // Retrieve the profile information from the database
        const profile = yield prisma_1.default.userProfile.findFirst({
            where: {
                userId: existingUser.id,
            },
            include: {
                user: true, // Include user information
            },
        });
        if (!profile) {
            // Profile not found
            throw new ApiError_1.default(http_status_codes_1.default.NOT_FOUND, "There is no profile of you");
        }
        // Format the response
        const responseData = {
            id: profile.id,
            userId: profile.userId,
            bio: profile.bio,
            age: profile.age,
            createdAt: profile.createdAt.toISOString(),
            updatedAt: profile.updatedAt.toISOString(),
            user: {
                id: profile.user.id,
                name: profile.user.name,
                email: profile.user.email,
                createdAt: profile.user.createdAt.toISOString(),
                updatedAt: profile.user.updatedAt.toISOString(),
            },
        };
        return responseData;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_codes_1.default.BAD_REQUEST, "Error in getting profile data");
    }
});
const updateProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Extract user ID from the authenticated user
        const { email } = req.user;
        // Retrieve the user ID using the email
        const existingUser = yield prisma_1.default.user.findFirst({
            where: {
                email,
            },
        });
        if (!existingUser) {
            throw new Error("User not found");
        } // Assuming user ID is available in the request
        const { bio, age } = req.body;
        const updatedProfile = yield prisma_1.default.userProfile.update({
            where: {
                userId: existingUser.id,
            },
            data: {
                bio: bio,
                age: age,
                updatedAt: new Date(),
            },
        });
        const userProfile = yield prisma_1.default.userProfile.findUnique({
            where: {
                userId: existingUser.id,
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
            },
        });
        if (!userProfile) {
            throw new ApiError_1.default(http_status_codes_1.default.NOT_FOUND, "User profile not found");
        }
        return userProfile;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_codes_1.default.BAD_REQUEST, "Failed in updating!");
    }
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma_1.default.user.findMany();
    return users;
});
exports.UserServices = {
    getProfile,
    updateProfile,
    getAllUsers,
};
