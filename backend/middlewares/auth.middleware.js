import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const verifyJWT = asyncHandler(async (req, res, next) => {
    try {
      // when loged in we set the accessToken in the cookie, so now using that only

      //     cookie("accessToken", accessToken, options)
      // .cookie("refreshToken", refreshToken, options)
      const token =
        req.cookies?.accessToken ||
        req.header("Authorization")?.replace("Bearer ", "");
        // Bearer : eyjklk....., Bearer ko hartane k liye

      if (!token) {
        throw new ApiError(401, "Unauthorized request");
      }

      const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

      const user = await User.findById(decodedToken?._id).select(
        "-password -refreshToken"
      );

      if (!user) {
        throw new ApiError(401, "Invalid Access Token");
      }

      req.user = user;
      // By attaching the user to req, we make it available to all subsequent middleware and route handlers
      // This is how we can access the user's information in protected routes without having to query the database again
      next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }
}); 