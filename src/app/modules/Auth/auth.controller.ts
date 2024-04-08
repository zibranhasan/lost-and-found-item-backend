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

export const AuthController = {
  loginUser,
  register,
};
