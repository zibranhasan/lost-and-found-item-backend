import httpStatus from "http-status-codes";
import sendResponse from "../../../shared/sendResponse";
import { Request, Response, NextFunction } from "express";
import { ClaimServices } from "./claim.service";
import catchAsync from "../../../shared/catchAsync";

const createClaim = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    const {
      foundItemId,
      distinguishingFeatures,
      lostDate,
      verificationMethod,
      verificationDetails,
      contactInformation,
    } = req.body;

    const claim = await ClaimServices.createClaim({
      email: user.email,
      foundItemId,
      distinguishingFeatures,
      lostDate,
      verificationMethod,
      verificationDetails,
      contactInformation,
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

const getAllClaims = catchAsync(async (req: Request, res: Response) => {
  const result = await ClaimServices.getAllClaims();
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Claims retrieved successfully!",
    data: result,
  });
});

const updateClaimStatus = catchAsync(async (req: Request, res: Response) => {
  const { claimId } = req.params;
  const data = req.body; // Assume that data contains the fields you want to update

  const updatedClaim = await ClaimServices.updateClaimFields(claimId, data);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Claim updated successfully",
    data: updatedClaim,
  });
});

const getMyClaims = catchAsync(async (req: Request, res: Response) => {
  const userEmail = req.user.email;
  const claims = await ClaimServices.getMyClaims(userEmail);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Claims retrieved successfully!",
    data: claims,
  });
});

const deleteClaim = catchAsync(async (req: Request, res: Response) => {
  const { claimId } = req.params;
  await ClaimServices.deleteClaim(claimId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Claim deleted successfully",
    data: [],
  });
});

export const claimController = {
  createClaim,
  getAllClaims,
  updateClaimStatus,
  getMyClaims,
  deleteClaim,
};
