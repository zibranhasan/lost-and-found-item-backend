"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.foundItemCategoryValidation = void 0;
const zod_1 = require("zod");
const createFoundItemCategorySchema = zod_1.z.object({
    name: zod_1.z.string(),
});
exports.foundItemCategoryValidation = {
    createFoundItemCategorySchema,
};
