import httpStatus from "http-status-codes";
import { NextFunction, Request, Response } from "express";
import { jwtHelpers } from "../../helpers/jwtHelpers";
import config from "../../config";
import ApiError from "../errors/ApiError";

const auth = (...roles: string[]) => {
  return async (
    req: Request & { user?: any },
    res: Response,
    next: NextFunction
  ) => {
    try {
      const token = req.headers.authorization;

      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized");
      }

      const verifiedUser = jwtHelpers.varifyToken(
        token,
        config.jwt.jwt_secret as string
      );

      req.user = verifiedUser;

      if (roles.length && !roles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, "Forbidden");
      }
      next();
    } catch (err) {
      next(err);
    }
  };
};

export default auth;
