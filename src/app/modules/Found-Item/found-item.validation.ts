import { z } from "zod";

const createFoundItemSchema = z.object({
  categoryId: z.string(),
  foundItemName: z.string(),
  description: z.string(),
  location: z.string(),
});

const updateClaimStatusSchema = z.object({
  status: z.string(),
});

export const foundItemValidation = {
  createFoundItemSchema,
  updateClaimStatusSchema,
};
