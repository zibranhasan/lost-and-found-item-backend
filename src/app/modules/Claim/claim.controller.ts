import httpStatus from "http-status-codes";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response, NextFunction } from "express";
import { ClaimServices } from "./claim.service";
import catchAsync from "../../../shared/catchAsync";

declare global {
  namespace Express {
    interface Request {
      user: any; // Change 'any' to the actual type of your user object
    }
  }
}
const createClaim = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const { foundItemId, distinguishingFeatures, lostDate } = req.body;

    console.log("user in claim", user);

    // Create the claim using the provided data
    const claim = await ClaimServices.createClaim({
      email: user.email,
      foundItemId,
      distinguishingFeatures,
      lostDate,
    });

    sendResponse(res, {
      statusCode: httpStatus.CREATED,
      success: true,
      message: "Claim created successfully",
      data: claim,
    });
  } catch (error) {
    next(error);
  }
};

const getAllClaimFromDB = catchAsync(async (req: Request, res: Response) => {
  const result = await ClaimServices.getClaims(req, res);
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Claims retrieved successfully!",
    data: result,
  });
});

const updateClaimStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const claimId = req.params.claimId;
    const { status } = req.body;

    // Update the claim status
    const updatedClaim = await ClaimServices.updateClaimStatus(claimId, status);

    // Send success response with the updated claim data
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Claim updated successfully",
      data: updatedClaim,
    });
  } catch (error) {
    next(error);
  }
};
const getMyClaims = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userEmail = req.user.email;

    const claims = await ClaimServices.getMyClaims(userEmail);

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Claims retrieved successfully!",
      data: claims,
    });
  } catch (error) {
    next(error);
  }
};

export const claimController = {
  createClaim,
  getAllClaimFromDB,
  updateClaimStatus,
  getMyClaims,
};
