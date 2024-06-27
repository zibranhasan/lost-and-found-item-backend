import httpStatus from "http-status-codes";
import sendResponse from "../../../shared/sendResponse";
import { NextFunction, Request, Response } from "express";
import { FoundItemService } from "./found-Item.service";
import { foundItemFilterableFields } from "./foundItem.constant";
import catchAsync from "../../../shared/catchAsync";
import pick from "../../../shared/pick";
// Extend the Request interface to include a user property
declare global {
  namespace Express {
    interface Request {
      user: any; // Change 'any' to the actual type of your user object
    }
  }
}
export const createfoundItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user;
    const bodyData = req.body;

    // console.log("body data", bodyData);
    const createdFoundItem = await FoundItemService.createFoundItem(
      user,
      bodyData
    );

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Found item category created successfully",
      data: createdFoundItem,
    });
  } catch (error) {
    next(error);
  }
};

const getAllFoundItemFromDB = catchAsync(async (req, res) => {
  const filters = pick(req.query, foundItemFilterableFields);
  const options = pick(req.query, ["limit", "page", "sortBy", "sortOrder"]);

  const result = await FoundItemService.getAllFoundItemFromDB(filters, options);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Found items retrieved successfully!",
    meta: result.meta,
    data: result.data,
  });
});

export const getFoundItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const foundItems = await FoundItemService.getFoundItems(req.user.email);
    sendResponse(res, {
      statusCode: httpStatus.ACCEPTED,
      success: true,
      message: "Found items retrieved successfully!",
      data: foundItems,
    });
  } catch (error) {
    next(error);
  }
};

const getRecentFoundItemsWithFilteringController = async (
  req: Request,
  res: Response
) => {
  try {
    const { category, location, keyword } = req.query;

    const foundItems = await FoundItemService.getRecentFoundItemsWithFiltering({
      category: category?.toString(),
      location: location?.toString(),
      keyword: keyword?.toString(),
    });

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Filtered found items fetched successfully",
      data: foundItems,
    });
  } catch (error: any) {}
};

const getFoundItemById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { foundId } = req.params;

    const foundItem = await FoundItemService.getFoundItemById(foundId);

    if (!foundItem) {
      return res.status(httpStatus.NOT_FOUND).send({
        statusCode: httpStatus.NOT_FOUND,
        success: false,
        message: "Found item not found",
      });
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Found item retrieved successfully",
      data: foundItem,
    });
  } catch (error) {
    next(error);
  }
};

export const foundItemController = {
  createfoundItem,
  getAllFoundItemFromDB,
  getFoundItems,
  getRecentFoundItemsWithFilteringController,
  getFoundItemById,
};
