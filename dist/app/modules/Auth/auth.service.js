"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.AuthServices = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const bcrypt = __importStar(require("bcrypt"));
const config_1 = __importDefault(require("../../../config"));
const uuid_1 = require("uuid");
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const register = (data) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, profile } = data;
        const hashedPassword = yield bcrypt.hash(password, 12);
        const result = yield prisma_1.default.$transaction((transactionClient) => __awaiter(void 0, void 0, void 0, function* () {
            const createdUserData = yield transactionClient.user.create({
                data: {
                    id: (0, uuid_1.v4)(),
                    name,
                    email,
                    password: hashedPassword,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });
            // Create user profile
            const createdProfileData = yield transactionClient.userProfile.create({
                data: {
                    id: (0, uuid_1.v4)(), // Generate a unique ID for the profile
                    userId: createdUserData.id, // Associate the profile with the created user
                    bio: profile.bio,
                    age: profile.age,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            });
            return {
                id: createdUserData.id,
                name: createdUserData.name,
                email: createdUserData.email,
                status: createdUserData.status,
                createdAt: createdUserData.createdAt.toISOString(),
                updatedAt: createdUserData.updatedAt.toISOString(),
                profile: {
                    id: createdProfileData.id,
                    userId: createdProfileData.userId,
                    bio: createdProfileData.bio,
                    age: createdProfileData.age,
                    createdAt: createdProfileData.createdAt.toISOString(),
                    updatedAt: createdProfileData.updatedAt.toISOString(),
                },
            };
        }));
        return result;
    }
    catch (error) {
        console.error("Error in register:", error);
        throw error; // Re-throw the error to be handled by the caller
    }
});
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: payload.email,
        },
    });
    if (userData.status !== "ACTIVE") {
        throw new ApiError_1.default(http_status_codes_1.default.FORBIDDEN, "User is inactive");
    }
    const isCorrectPassword = yield bcrypt.compare(payload.password, userData.password);
    if (!isCorrectPassword) {
        throw new ApiError_1.default(http_status_codes_1.default.FORBIDDEN, "Password incorrect");
    }
    const accessToken = jwtHelpers_1.jwtHelpers.generateToken({
        email: userData.email,
        userId: userData.id,
        role: userData.role,
    }, config_1.default.jwt.jwt_secret, config_1.default.jwt.expires_in);
    return {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData === null || userData === void 0 ? void 0 : userData.role,
        token: accessToken,
    };
});
const changePassword = (user, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const userData = yield prisma_1.default.user.findUniqueOrThrow({
        where: {
            email: user.email,
        },
    });
    const isCorrectPassword = yield bcrypt.compare(payload.oldPassword, userData.password);
    if (!isCorrectPassword) {
        throw new Error("Password incorrect");
    }
    if (userData.status !== "ACTIVE") {
        throw new Error("User is not active");
    }
    const hashedPassword = yield bcrypt.hash(payload.newPassword, 12);
    yield prisma_1.default.user.update({
        where: {
            email: userData.email,
        },
        data: {
            password: hashedPassword,
        },
    });
    return {
        message: "Password changed successfully",
    };
});
const updateUserStatus = (userId, status) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedUser = yield prisma_1.default.user.update({
            where: { id: userId },
            data: { status },
            include: {
                profile: true, // Include profile if needed
            },
        });
        return updatedUser;
    }
    catch (error) {
        console.error("Error in updateUserStatus:", error);
        throw error;
    }
});
exports.AuthServices = {
    loginUser,
    register,
    changePassword,
    updateUserStatus,
};
