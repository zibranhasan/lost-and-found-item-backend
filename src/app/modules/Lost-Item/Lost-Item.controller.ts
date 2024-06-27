import { NextFunction, Request, Response } from "express";
import { lostItemService } from "./Lost-Item.service";
import prisma from "../../../shared/prisma";
import sendResponse from "../../../shared/sendResponse";

export const createLostItem = async (req: Request, res: Response) => {
  try {
    const { userId, photo, categoryName, name, description, location } =
      req.body;

    const newLostItem = await lostItemService.createLostItem({
      userId,
      photo,
      categoryName,
      name,
      description,
      location,
    });

    res.status(201).json(newLostItem);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getRecentLostItems = async (req: Request, res: Response) => {
  try {
    const recentLostItems = await lostItemService.fetchRecentLostItems();
    res.status(200).json({ data: recentLostItems });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getUserLostItems = async (req: Request, res: Response) => {
  try {
    const { email } = req.user;
    // Retrieve the user ID using the email
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!existingUser) {
      throw new Error("User not found");
    }

    const { id: userId } = existingUser;
    const userLostItems = await lostItemService.fetchUserLostItems(userId);
    res.status(200).json(userLostItems);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getLostItemById = async (req: Request, res: Response) => {
  try {
    const { lostId } = req.params;
    const lostItem = await lostItemService.getLostItemById(lostId);
    if (!lostItem) {
      return res.status(404).json({ error: "Lost item not found" });
    }
    res.status(200).json({ data: { lostItem } });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const getMyLostItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const userEmail = req.user.email;

    const lostItems = await lostItemService.getMyLostItems(userEmail);

    sendResponse(res, {
      statusCode: 202,
      success: true,
      message: "Lost items retrieved successfully!",
      data: lostItems,
    });
  } catch (error) {
    next(error);
  }
};

export const getRecentLostItemsWithFilteringController = async (
  req: Request,
  res: Response
) => {
  try {
    const { category, location, keyword } = req.query;

    const lostItems = await lostItemService.getRecentLostItemsWithFiltering({
      category: category?.toString(),
      location: location?.toString(),
      keyword: keyword?.toString(),
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Filtered lost items fetched successfully",
      data: lostItems,
    });
  } catch (error: any) {}
};
export const lostItemController = {
  createLostItem,
  getRecentLostItems,
  getUserLostItems,
  getLostItemById,
  getMyLostItems,
  getRecentLostItemsWithFilteringController,
};
