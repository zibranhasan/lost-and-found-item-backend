import httpStatus from "http-status-codes";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response } from "express";
import { FoundItemCategoryService } from "./Found-item-categories.service";

const foundItemCategories = catchAsync(async (req: Request, res: Response) => {
  const category = await FoundItemCategoryService.createFoundItemCategory(
    req.body
  );

  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Found item category created successfully",
    data: category,
  });
});

const getAllFoundItemCategories = catchAsync(
  async (req: Request, res: Response) => {
    const categories =
      await FoundItemCategoryService.getAllFoundItemCategories();

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Found item categories retrieved successfully",
      data: categories,
    });
  }
);

export const foundItemCategoriesController = {
  foundItemCategories,
  getAllFoundItemCategories,
};
