import { z } from "zod";

const createFoundItemSchema = z.object({
  categoryName: z.string(),
  foundItemName: z.string(),
  photo: z.string(),
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
