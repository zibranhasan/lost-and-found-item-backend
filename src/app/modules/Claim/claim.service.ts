import httpStatus from "http-status-codes";
import ApiError from "../../errors/ApiError";
import prisma from "../../../shared/prisma";
import { Request, Response } from "express";

interface CreateClaimData {
  email: string;
  foundItemId: string;
  distinguishingFeatures: string;
  lostDate: Date;
}

const createClaim = async (data: CreateClaimData) => {
  try {
    const { email, foundItemId, distinguishingFeatures, lostDate } = data;

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

    // Check if the found item exists
    const foundItem = await prisma.foundItem.findUnique({
      where: {
        id: foundItemId,
      },
    });

    if (!foundItem) {
      throw new ApiError(httpStatus.NOT_FOUND, "Found item not found");
    }

    // Create the claim
    const createdClaim = await prisma.claim.create({
      data: {
        userId, // Include userId here
        foundItemId,
        distinguishingFeatures,
        lostDate,
        status: "PENDING",
      },
    });

    return createdClaim;
  } catch (error) {
    // Handle any errors
    console.error("Error creating claim:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};
const getClaims = async (req: Request, res: Response) => {
  try {
    const result = await prisma.claim.findMany({
      include: {
        foundItem: {
          include: {
            user: true,
            category: true,
          },
        },
      },
    });

    const formattedClaims = result.map((claim) => {
      const {
        id,
        userId,
        foundItemId: claimFoundItemId, // Rename the variable here
        distinguishingFeatures,
        lostDate,
        status,
        createdAt,
        updatedAt,
        foundItem: {
          id: foundItemId,
          userId: foundItemUserId,
          categoryId,
          foundItemName,
          description,
          location,
          createdAt: foundItemCreatedAt,
          updatedAt: foundItemUpdatedAt,
          user,
          category,
        },
      } = claim;

      return {
        id,
        userId,
        foundItemId: claimFoundItemId, // Use the renamed variable here
        distinguishingFeatures,
        lostDate,
        status,
        createdAt,
        updatedAt,
        foundItem: {
          id: foundItemId,
          userId: foundItemUserId,
          categoryId,
          foundItemName,
          description,
          location,
          createdAt: foundItemCreatedAt,
          updatedAt: foundItemUpdatedAt,
          user,
          category,
        },
      };
    });
    return formattedClaims;
  } catch (error) {}
};

const updateClaimStatus = async (
  claimId: string,
  status: string
): Promise<any> => {
  try {
    // Update the claim status in the database
    const updatedClaim = await prisma.claim.update({
      where: {
        id: claimId,
      },
      data: {
        status,
      },
      // Optionally include additional fields to be returned in the response
      select: {
        id: true,
        userId: true,
        foundItemId: true,
        distinguishingFeatures: true,
        lostDate: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return updatedClaim;
  } catch (error) {
    throw new ApiError(
      httpStatus.BAD_REQUEST,
      "There are issues updaeting claim"
    );
  }
};
export const ClaimServices = {
  createClaim,
  getClaims,
  updateClaimStatus,
};
