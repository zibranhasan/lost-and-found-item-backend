import httpStatus from "http-status-codes";
import ApiError from "../../errors/ApiError";
import prisma from "../../../shared/prisma";

const createFoundItemCategory = async (data: any) => {
  const { name } = data;

  // Check if category with the same name already exists
  const existingCategory = await prisma.foundItemCategory.findFirst({
    where: {
      name,
    },
  });

  if (existingCategory) {
    throw new ApiError(httpStatus.MULTI_STATUS, "Category already exist");
  }

  const createdCategory = await prisma.foundItemCategory.create({
    data: {
      name,
    },
  });

  return createdCategory;
};

export const FoundItemCategoryService = {
  createFoundItemCategory,
};
