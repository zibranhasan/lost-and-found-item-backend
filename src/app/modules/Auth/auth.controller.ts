import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { AuthServices } from "./auth.service";

const register = catchAsync(async (req: Request, res: Response) => {
  const data = req.body;
  const result = await AuthServices.register(data);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "registration successful!",
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthServices.loginUser(req.body);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: "User logged in successfully",
    data: {
      ...result,
    },
  });
});

const changePassword = catchAsync(async (req, res) => {
  const user = req.user;
  const result = await AuthServices.changePassword(user, req.body);

  sendResponse(res, {
    statusCode: 202,
    success: true,
    message: "Password changed successfully",
    data: result,
  });
});

const updateUserStatus = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { status } = req.body;

  try {
    const updatedUser = await AuthServices.updateUserStatus(userId, status);

    sendResponse(res, {
      statusCode: 202,
      success: true,
      message: "User status updated successfully",
      data: updatedUser,
    });
  } catch (error) {}
};

export const AuthController = {
  loginUser,
  register,
  changePassword,
  updateUserStatus,
};
