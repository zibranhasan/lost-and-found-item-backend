"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = require("zod");
const userUpdateSchema = zod_1.z.object({
    bio: zod_1.z.string(),
    age: zod_1.z.number(),
});
exports.userValidation = {
    userUpdateSchema,
};
