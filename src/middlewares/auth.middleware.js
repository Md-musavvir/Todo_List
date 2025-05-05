import { User } from "../models/user.models.js";
import dotenv from "dotenv";

import ApiError from "../utils/ApiError.js";
import asyncHandler from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";

const verifyJwt = asyncHandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer", "").trim();
    if (!token) {
      throw new ApiError(403, "token is not present");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );
    if (!user) {
      throw new ApiError(400, "user not found");
    }
    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, "Invalid accessToken");
  }
});
export default verifyJwt;
