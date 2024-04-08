import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";

const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode = httpStatus.INTERNAL_SERVER_ERROR;
  let errorMessage = "Something went wrong!";
  let errorDetails: any = err;

  // Check if it's a Zod validation error
  if (err.issues) {
    statusCode = httpStatus.BAD_REQUEST;
    errorMessage = err.issues.map((issue: any) => issue.message).join(". ");
    errorDetails = { issues: err.issues };
  } else if (err.name === "UnauthorizedError") {
    statusCode = httpStatus.UNAUTHORIZED;
    errorMessage = "Unauthorized";
    errorDetails = err.message;
  }

  res.status(statusCode).json({
    success: false,
    message: errorMessage,
    errorDetails: errorDetails,
  });
};

export default globalErrorHandler;
