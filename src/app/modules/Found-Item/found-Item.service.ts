import { Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../interfaces/pagination";
import { foundItemSearchAbleFields } from "./foundItem.constant";

const createFoundItem = async (user: { email: string }, bodyData: any) => {
  const { categoryId, foundItemName, description, location } = bodyData;
  const { email } = user;

  try {
    // Retrieve the user ID using the email
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    const {
      id: userId,
      name,
      email: userEmail,
      createdAt: userCreatedAt,
      updatedAt: userUpdatedAt,
    } = existingUser;

    // Retrieve the category details
    const category = await prisma.foundItemCategory.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    const {
      id: categoryIdResult,
      name: categoryName,
      createdAt: categoryCreatedAt,
      updatedAt: categoryUpdatedAt,
    } = category;

    // Create the found item
    const createdFoundItem = await prisma.foundItem.create({
      data: {
        userId,
        categoryId: categoryIdResult,
        foundItemName,
        description,
        location,
      },
    });

    return {
      id: createdFoundItem.id,
      userId: createdFoundItem.userId,
      user: {
        id: userId,
        name,
        email: userEmail,
        createdAt: userCreatedAt.toISOString(),
        updatedAt: userUpdatedAt.toISOString(),
      },
      categoryId: createdFoundItem.categoryId,
      category: {
        id: categoryIdResult,
        name: categoryName,
        createdAt: categoryCreatedAt.toISOString(),
        updatedAt: categoryUpdatedAt.toISOString(),
      },
      foundItemName: createdFoundItem.foundItemName,
      description: createdFoundItem.description,
      location: createdFoundItem.location,
      createdAt: createdFoundItem.createdAt.toISOString(),
      updatedAt: createdFoundItem.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("Error creating found item:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

const getAllFoundItemFromDB = async (
  params: any,
  options: IPaginationOptions
) => {
  const { page, limit, skip } = paginationHelper.calculatePagination(options);
  const { searchTerm, ...filterData } = params;

  const andConditions: Prisma.FoundItemWhereInput[] = [];

  if (params.searchTerm) {
    andConditions.push({
      OR: foundItemSearchAbleFields.map((field) => ({
        [field]: {
          contains: params.searchTerm,
          mode: "insensitive",
        },
      })),
    });
  }

  if (Object.keys(filterData).length > 0) {
    andConditions.push({
      AND: Object.keys(filterData).map((key) => ({
        [key]: {
          equals: (filterData as any)[key],
        },
      })),
    });
  }

  const whereConditions: Prisma.FoundItemWhereInput =
    andConditions.length > 0 ? { AND: andConditions } : {};

  const foundItems = await prisma.foundItem.findMany({
    where: whereConditions,
    skip,
    take: limit,
    orderBy:
      options.sortBy && options.sortOrder
        ? {
            [options.sortBy]: options.sortOrder,
          }
        : {
            createdAt: "desc",
          },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          updatedAt: true,
        },
      },
      category: {
        select: {
          id: true,
          name: true,
          createdAt: true,
          updatedAt: true,
        },
      },
    },
  });

  const total = await prisma.foundItem.count({
    where: whereConditions,
  });

  const formattedFoundItems = foundItems.map((foundItem) => ({
    id: foundItem.id,
    foundItemName: foundItem.foundItemName,
    description: foundItem.description,
    location: foundItem.location,
    createdAt: foundItem.createdAt.toISOString(),
    updatedAt: foundItem.updatedAt.toISOString(),
    user: {
      id: foundItem.user.id,
      name: foundItem.user.name,
      email: foundItem.user.email,
      createdAt: foundItem.user.createdAt.toISOString(),
      updatedAt: foundItem.user.updatedAt.toISOString(),
    },
    category: {
      id: foundItem.category.id,
      name: foundItem.category.name,
      createdAt: foundItem.category.createdAt.toISOString(),
      updatedAt: foundItem.category.updatedAt.toISOString(),
    },
  }));

  return {
    meta: { total, page, limit },
    data: formattedFoundItems,
  };
};

export const FoundItemService = {
  createFoundItem,
  getAllFoundItemFromDB,
};
