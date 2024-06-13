import httpStatus from "http-status-codes";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import config from "../../../config";
import { v4 as uuidv4 } from "uuid";
import ApiError from "../../errors/ApiError";

const register = async (data: any) => {
  try {
    const { name, email, password, profile } = data;

    const hashedPassword: string = await bcrypt.hash(password, 12);

    const result = await prisma.$transaction(async (transactionClient) => {
      const createdUserData = await transactionClient.user.create({
        data: {
          id: uuidv4(),
          name,
          email,
          password: hashedPassword,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      // Create user profile
      const createdProfileData = await transactionClient.userProfile.create({
        data: {
          id: uuidv4(), // Generate a unique ID for the profile
          userId: createdUserData.id, // Associate the profile with the created user
          bio: profile.bio,
          age: profile.age,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });

      return {
        id: createdUserData.id,
        name: createdUserData.name,
        email: createdUserData.email,
        status: createdUserData.status,
        createdAt: createdUserData.createdAt.toISOString(),
        updatedAt: createdUserData.updatedAt.toISOString(),
        profile: {
          id: createdProfileData.id,
          userId: createdProfileData.userId,
          bio: createdProfileData.bio,
          age: createdProfileData.age,
          createdAt: createdProfileData.createdAt.toISOString(),
          updatedAt: createdProfileData.updatedAt.toISOString(),
        },
      };
    });

    return result;
  } catch (error) {
    console.error("Error in register:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
};

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: payload.email,
    },
  });

  if (userData.status !== "ACTIVE") {
    throw new ApiError(httpStatus.FORBIDDEN, "User is inactive");
  }

  const isCorrectPassword = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new ApiError(httpStatus.FORBIDDEN, "Password incorrect");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      email: userData.email,
      userId: userData.id,
      role: userData.role,
    },
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string
  );

  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    role: userData?.role,
    token: accessToken,
  };
};

const changePassword = async (user: any, payload: any) => {
  const userData = await prisma.user.findUniqueOrThrow({
    where: {
      email: user.email,
    },
  });

  const isCorrectPassword = await bcrypt.compare(
    payload.oldPassword,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new Error("Password incorrect");
  }

  if (userData.status !== "ACTIVE") {
    throw new Error("User is not active");
  }

  const hashedPassword = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: {
      email: userData.email,
    },
    data: {
      password: hashedPassword,
    },
  });

  return {
    message: "Password changed successfully",
  };
};

const updateUserStatus = async (
  userId: string,
  status: "ACTIVE" | "INACTIVE"
) => {
  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { status },
      include: {
        profile: true, // Include profile if needed
      },
    });

    return updatedUser;
  } catch (error) {
    console.error("Error in updateUserStatus:", error);
    throw error;
  }
};

export const AuthServices = {
  loginUser,
  register,
  changePassword,
  updateUserStatus,
};
