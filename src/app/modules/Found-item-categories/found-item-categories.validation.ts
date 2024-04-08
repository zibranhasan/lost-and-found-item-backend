import { z } from "zod";

const createFoundItemCategorySchema = z.object({
  name: z.string(),
});

export const foundItemCategoryValidation = {
  createFoundItemCategorySchema,
};
