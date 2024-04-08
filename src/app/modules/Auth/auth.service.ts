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
    console.log(hashedPassword);

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
    },
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string
  );

  return {
    id: userData.id,
    name: userData.name,
    email: userData.email,
    token: accessToken,
  };
};

export const AuthServices = {
  loginUser,
  register,
};
