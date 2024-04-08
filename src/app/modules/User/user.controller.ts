import httpStatus from "http-status-codes";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response, NextFunction } from "express";
import catchAsync from "../../../shared/catchAsync";
import { UserServices } from "./user.service";

const getProfileFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await UserServices.getProfile(req, res);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile retrieved successfully!",
    data: result,
  });
});

const updateUserProfileFromDB = catchAsync(
  async (req: Request, res: Response) => {
    console.log(req.body, req.user);
    const result = await UserServices.updateProfile(req, res);
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "User profile updated successfully",
      data: result,
    });
  }
);

export const userController = {
  getProfileFromDB,
  updateUserProfileFromDB,
};
