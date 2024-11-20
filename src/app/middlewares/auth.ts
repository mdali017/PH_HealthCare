import { NextFunction, Request, Response } from "express";
import { JwtHelpers } from "../../helpars/jwtHelpers";
import config from "../../config";
import { JwtPayload } from "jsonwebtoken";
import ApiError from "../errors/ApiErrors";

const auth = (...roles: string[]) => {
  return async (req: Request & {user?: any}, res: Response, next: NextFunction) => {
    try {
      const token = req.headers.authorization;
      if (!token) {
        // throw new Error("Token is missing");
        throw new ApiError(401, "You Are Not Authorized");
      }
      const verifyUser = JwtHelpers.verifyToken(
        token,
        config.jwt.jwt_secret as string
      ) as JwtPayload & { role: string };

      req.user = verifyUser;

      // console.log({ verifyUser });

      if (roles.length && !roles.includes(verifyUser.role)) {
        throw new ApiError(403, "Forbidden");
      }
      next();
    } catch (error) {
      next(error);
    }
  };
};

export default auth;
