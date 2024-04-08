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
exports.FoundItemCategoryService = void 0;
const http_status_codes_1 = __importDefault(require("http-status-codes"));
const ApiError_1 = __importDefault(require("../../errors/ApiError"));
const prisma_1 = __importDefault(require("../../../shared/prisma"));
const createFoundItemCategory = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const { name } = data;
    // Check if category with the same name already exists
    const existingCategory = yield prisma_1.default.foundItemCategory.findFirst({
        where: {
            name,
        },
    });
    if (existingCategory) {
        throw new ApiError_1.default(http_status_codes_1.default.MULTI_STATUS, "Category already exist");
    }
    const createdCategory = yield prisma_1.default.foundItemCategory.create({
        data: {
            name,
        },
    });
    return createdCategory;
});
exports.FoundItemCategoryService = {
    createFoundItemCategory,
};
