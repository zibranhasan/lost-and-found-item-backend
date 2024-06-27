import prisma from "../../../shared/prisma";

const getCategoryIdByName = async (categoryName: string) => {
  const category = await prisma.foundItemCategory.findFirst({
    where: { name: categoryName },
  });
  return category ? category.id : null;
};

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

const createLostItem = async (data: any) => {
  const { userId, categoryName, photo, name, description, location } = data;

  try {
    // Get or create the category
    const categoryId = await getOrCreateCategory(categoryName);

    // Create the lost item with the retrieved/created category ID
    const newLostItem = await prisma.lostItem.create({
      data: {
        userId,
        categoryId,
        name,
        photo,
        description,
        location,
      },
    });

    return newLostItem;
  } catch (error) {
    throw new Error("Could not create lost item");
  }
};

const fetchRecentLostItems = async () => {
  try {
    const recentLostItems = await prisma.lostItem.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 10, // Change the number of items to fetch as per requirement
    });
    return recentLostItems;
  } catch (error) {
    throw new Error("Could not fetch recent lost items");
  }
};

const fetchUserLostItems = async (userId: string) => {
  try {
    const userLostItems = await prisma.lostItem.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return userLostItems;
  } catch (error) {
    throw new Error("Could not fetch lost items for the user");
  }
};

const getLostItemById = async (lostId: string) => {
  try {
    const lostItem = await prisma.lostItem.findUnique({
      where: { id: lostId },
      include: {
        category: true,
        user: true, // Include the related category information
      },
    });
    return lostItem;
  } catch (error) {
    throw new Error("Could not retrieve lost item");
  }
};

const getMyLostItems = async (email: string) => {
  try {
    // Find the user by email
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const userId = user.id;

    // Retrieve lost items associated with the user ID
    const lostItems = await prisma.lostItem.findMany({
      where: {
        userId,
      },
      include: {
        category: true,
      },
    });

    return lostItems;
  } catch (error) {
    console.error("Error retrieving lost items:", error);
    throw error;
  }
};

const getRecentLostItemsWithFiltering = async (filters: any) => {
  const { category, location, keyword } = filters;

  try {
    const where: any = {};

    if (category) {
      const categoryId = await getCategoryIdByName(category);
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

    const lostItems = await prisma.lostItem.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      include: {
        category: true,
      },
    });

    return lostItems;
  } catch (error) {
    throw new Error("Could not fetch filtered lost items");
  }
};

export const lostItemService = {
  createLostItem,
  fetchRecentLostItems,
  fetchUserLostItems,
  getLostItemById,
  getMyLostItems,
  getRecentLostItemsWithFiltering,
};
