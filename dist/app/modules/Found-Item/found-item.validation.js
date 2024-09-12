"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.foundItemValidation = void 0;
const zod_1 = require("zod");
const createFoundItemSchema = zod_1.z.object({
    categoryName: zod_1.z.string(),
    foundItemName: zod_1.z.string(),
    photo: zod_1.z.string(),
    description: zod_1.z.string(),
    location: zod_1.z.string(),
});
const updateClaimStatusSchema = zod_1.z.object({
    status: zod_1.z.string(),
});
exports.foundItemValidation = {
    createFoundItemSchema,
    updateClaimStatusSchema,
};
