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
export const foundItemCategoriesController = {
  foundItemCategories,
};
