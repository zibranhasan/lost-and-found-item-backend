import httpStatus from "http-status-codes";
import ApiError from "../../errors/ApiError";
import prisma from "../../../shared/prisma";
import { Request, Response } from "express";

const getProfile = async (req: Request, res: Response) => {
  try {
    // Extract user ID from the authenticated user
    const { email } = req.user;
    // Retrieve the user ID using the email
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!existingUser) {
      throw new Error("User not found");
    }
    // Retrieve the profile information from the database
    const profile = await prisma.userProfile.findFirst({
      where: {
        userId: existingUser.id,
      },
      include: {
        user: true, // Include user information
      },
    });

    if (!profile) {
      // Profile not found
      throw new ApiError(httpStatus.NOT_FOUND, "There is no profile of you");
    }

    // Format the response
    const responseData = {
      id: profile.id,
      userId: profile.userId,
      bio: profile.bio,
      age: profile.age,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
      user: {
        id: profile.user.id,
        name: profile.user.name,
        email: profile.user.email,
        createdAt: profile.user.createdAt.toISOString(),
        updatedAt: profile.user.updatedAt.toISOString(),
      },
    };
    return responseData;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Error in getting profile data");
  }
};

const updateProfile = async (req: Request, res: Response) => {
  try {
    // Extract user ID from the authenticated user
    const { email } = req.user;
    // Retrieve the user ID using the email
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
      },
    });

    if (!existingUser) {
      throw new Error("User not found");
    } // Assuming user ID is available in the request

    const { bio, age } = req.body;

    const updatedProfile = await prisma.userProfile.update({
      where: {
        userId: existingUser.id,
      },
      data: {
        bio: bio,
        age: age,
        updatedAt: new Date(),
      },
    });

    const userProfile = await prisma.userProfile.findUnique({
      where: {
        userId: existingUser.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    if (!userProfile) {
      throw new ApiError(httpStatus.NOT_FOUND, "User profile not found");
    }

    return userProfile;
  } catch (error) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Failed in updating!");
  }
};

const getAllUsers = async (): Promise<any> => {
  const users = await prisma.user.findMany();
  return users;
};

export const UserServices = {
  getProfile,
  updateProfile,
  getAllUsers,
};
