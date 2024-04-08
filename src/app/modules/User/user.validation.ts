import { z } from "zod";

const userUpdateSchema = z.object({
  bio: z.string(),
  age: z.number(),
});

export const userValidation = {
  userUpdateSchema,
};
