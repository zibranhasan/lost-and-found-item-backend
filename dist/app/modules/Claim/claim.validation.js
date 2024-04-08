"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.claimValidation = void 0;
const zod_1 = require("zod");
const createClaimSchema = zod_1.z.object({
    foundItemId: zod_1.z.string(),
    distinguishingFeatures: zod_1.z.string(),
    lostDate: zod_1.z.string(), // Assuming lostDate is a string in ISO 8601 format
});
const updateClaimStatusSchema = zod_1.z.object({
    status: zod_1.z.string(),
});
exports.claimValidation = {
    createClaimSchema,
    updateClaimStatusSchema,
};
