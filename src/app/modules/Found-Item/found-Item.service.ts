import { Prisma } from "@prisma/client";
import { paginationHelper } from "../../../helpers/paginationHelper";
import prisma from "../../../shared/prisma";
import { IPaginationOptions } from "../../interfaces/pagination";
import { foundItemSearchAbleFields } from "./foundItem.constant";
import ApiError from "../../errors/ApiError";

const getOrCreateCategory = async (categoryName: string) => {
  let category = await prisma.foundItemCategory.findFirst({
    where: { name: categoryName },
  });

  if (!category) {
    category = await prisma.foundItemCategory.create({
      data: { name: categoryName },
    });
  }

  return category.id;
};

const createFoundItem = async (user: { email: string }, bodyData: any) => {
  const { foundItemName, photo, description, location, categoryName } =
    bodyData;
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

    // Get or create the category
    const categoryId = await getOrCreateCategory(categoryName);

    // Create the found item
    const createdFoundItem = await prisma.foundItem.create({
      data: {
        userId,
        categoryId,
        foundItemName,
        photo,
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
        id: categoryId,
        name: categoryName,
      },
      foundItemName: createdFoundItem.foundItemName,
      photo: createdFoundItem.photo,
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
    photo: foundItem.photo,
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

export const getFoundItems = async (email: string) => {
  // Retrieve the user ID using the email
  const existingUser = await prisma.user.findFirst({
    where: { email },
  });

  if (!existingUser) {
    throw new ApiError(404, "User not found");
  }

  const { id: userId } = existingUser;

  // Retrieve found items for the user
  const foundItems = await prisma.foundItem.findMany({
    where: { userId },
    include: {
      category: true, // Include category information
    },
  });

  return foundItems;
};
export const getRecentFoundItemsWithFiltering = async (filters: any) => {
  const { category, location, keyword } = filters;

  try {
    const where: any = {};

    if (category) {
      const categoryId = await getOrCreateCategory(category);
      if (categoryId) {
        where.categoryId = categoryId;
      }
    }

    if (location) {
      where.location = {
        contains: location,
        mode: "insensitive",
      };
    }

    if (keyword) {
      where.description = {
        contains: keyword,
        mode: "insensitive",
      };
    }

    const foundItems = await prisma.foundItem.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
      },
    });

    return foundItems;
  } catch (error) {
    console.error("Error fetching recent found items:", error);
  }
};
const getFoundItemById = async (id: string) => {
  try {
    const foundItem = await prisma.foundItem.findUniqueOrThrow({
      where: { id },
      include: {
        user: true,
        category: true,
      },
    });

    if (!foundItem) {
      return null;
    }

    return {
      id: foundItem.id,
      userId: foundItem.userId,
      user: {
        id: foundItem.user.id,
        name: foundItem.user.name,
        email: foundItem.user.email,
        createdAt: foundItem.user.createdAt.toISOString(),
        updatedAt: foundItem.user.updatedAt.toISOString(),
      },
      categoryId: foundItem.categoryId,
      category: {
        id: foundItem.category.id,
        name: foundItem.category.name,
      },
      foundItemName: foundItem.foundItemName,
      photo: foundItem.photo,
      description: foundItem.description,
      location: foundItem.location,
      createdAt: foundItem.createdAt.toISOString(),
      updatedAt: foundItem.updatedAt.toISOString(),
    };
  } catch (error) {
    console.error("Error fetching found item:", error);
    throw error;
  }
};
export const FoundItemService = {
  createFoundItem,
  getAllFoundItemFromDB,
  getFoundItems,
  getRecentFoundItemsWithFiltering,
  getFoundItemById,
};
