import httpStatus from "http-status-codes";
import ApiError from "../../errors/ApiError";
import prisma from "../../../shared/prisma";
import { Prisma } from "@prisma/client";

interface CreateClaimData {
  email: string;
  foundItemId: string;
  distinguishingFeatures: string;
  lostDate: Date;
  verificationMethod: string;
  verificationDetails?: string;
  contactInformation?: string;
}

const createClaim = async (data: CreateClaimData) => {
  const {
    email,
    foundItemId,
    distinguishingFeatures,
    lostDate,
    verificationMethod,
    verificationDetails,
    contactInformation,
  } = data;

  const existingUser = await prisma.user.findFirst({
    where: { email },
  });

  if (!existingUser) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const foundItem = await prisma.foundItem.findUnique({
    where: { id: foundItemId },
  });

  if (!foundItem) {
    throw new ApiError(httpStatus.NOT_FOUND, "Found item not found");
  }

  const createdClaim = await prisma.claim.create({
    data: {
      userId: existingUser.id,
      foundItemId,
      distinguishingFeatures,
      lostDate,
      verificationMethod,
      verificationDetails,
      contactInformation,
      status: "PENDING",
    },
  });

  return createdClaim;
};

const getAllClaims = async () => {
  const claims = await prisma.claim.findMany({
    include: {
      foundItem: {
        include: { user: true, category: true },
      },
    },
  });
  return claims;
};

const updateClaimFields = async (
  claimId: string,
  data: Partial<Prisma.ClaimUpdateInput>
) => {
  // Validate if the claim exists before updating
  const existingClaim = await prisma.claim.findUnique({
    where: { id: claimId },
  });

  if (!existingClaim) {
    throw new ApiError(httpStatus.NOT_FOUND, "Claim not found");
  }

  // Update the claim with the provided data
  const updatedClaim = await prisma.claim.update({
    where: { id: claimId },
    data, // This will update only the fields provided in `data`
  });

  return updatedClaim;
};

const getMyClaims = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }

  const claims = await prisma.claim.findMany({
    where: { userId: user.id },
    include: { foundItem: true },
  });

  return claims;
};

const deleteClaim = async (claimId: string) => {
  await prisma.claim.delete({
    where: { id: claimId },
  });
};

export const ClaimServices = {
  createClaim,
  getAllClaims,
  updateClaimFields,
  getMyClaims,
  deleteClaim,
};
