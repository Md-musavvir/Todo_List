import asyncHandler from "../utils/AsyncHandler.js";

import ApiError from "./../utils/ApiError.js";
import { User } from "./../models/user.models.js";
import uploadOnCloudinary from "./../utils/cloudinary.js";
import ApiResponse from "./../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
const generateRefreshAndAccessToken = async (User_id) => {
  const user = await User.findById(User_id);
  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });
  return { accessToken, refreshToken };
};
const registerUser = asyncHandler(async (req, res) => {
  //take data from user
  //check if valid data is sent or not
  //check if user already exist or not
  //get avatar and image paths
  //upload on cloudinary
  //create user object in database
  //remove sensitive data from response
  //then send the response
  const { fullName, username, email, password } = req.body;
  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const existedUSer = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUSer) {
    throw new ApiError(400, "User Already exists");
  }
  const avatarPath = req.files?.avatar[0].path;
  let coverImagePath;
  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImagePath = req.files.coverImage[0].path;
  }
  if (!avatarPath) {
    throw new ApiError(400, "avatar not recieved");
  }
  let coverImage;

  const avatar = await uploadOnCloudinary(avatarPath);
  if (coverImagePath) {
    coverImage = await uploadOnCloudinary(coverImagePath);
  }

  if (!avatar) {
    console.log(avatar, "not recieved");
    throw new ApiError(500, "something went wrong while uploading");
  }
  const user = await User.create({
    fullName,
    username: username.toLowerCase(),
    email,
    avatar: avatar.url,
    coverImage: coverImage.url || "",
    password,
  });
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createdUser) {
    throw new ApiError(500, "something went wrong while registering");
  }
  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "user registered successfully"));
});
const loginUser = asyncHandler(async (req, res) => {
  //get data from user
  //username or email
  //find user
  //password check
  //access and refresh token
  //send cookies
  const { username, email, password } = req.body;
  if (!(username || email) || !password) {
    throw new ApiError(400, "credential are required");
  }
  const user = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (!user) {
    throw new ApiError(404, "user doesnt exist");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Incorrect Password");
  }
  const { accessToken, refreshToken } = await generateRefreshAndAccessToken(
    user._id
  );

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "user Logged in Successfully"
      )
    );
});
const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: {
        refreshToken: null,
      },
    },
    { new: true }
  );
  const options = {
    httpOnly: true,
    secure: true,
  };
  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "user LoggedOut successfully"));
});
const refreshAccessToken = asyncHandler(async (req, res) => {
  try {
    const incomingToken = req.cookies.refreshToken || req.body.refreshToken;

    if (!incomingToken) {
      throw new ApiError(400, "refresh  Token is missing");
    }
    const decodedToken = jwt.verify(
      incomingToken,
      process.env.REFRESH_TOKEN_SECRET
    );
    const user = await User.findById(decodedToken._id);
    if (!user) {
      throw new ApiError(400, "user not found");
    }

    if (incomingToken !== user?.refreshToken) {
      throw new ApiError(400, "refresh Token not matched");
    }
    const { accessToken, refreshToken: newRefreshToken } =
      await generateRefreshAndAccessToken(user._id);
    const options = {
      httpOnly: true,
      secure: true,
    };
    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "succesfully refreshed Access Token"
        )
      );
  } catch (error) {
    throw new ApiError(401, error?.message || "invalid refresh token");
  }
});
const changePassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  if (!(oldPassword && newPassword)) {
    throw new ApiError(400, "credentials are needed");
  }
  const user = await User.findById(req.user._id);
  if (!user) {
    throw new ApiError(400, "user not found");
  }
  const isPasswordValid = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordValid) {
    throw new ApiError(400, "incorrect password");
  }
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });
  res
    .status(200)
    .json(new ApiResponse(200, {}, "password changed successfully"));
});
const changeDetails = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;
  if (!fullName || !email) {
    throw new ApiError(400, "credentials are required");
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { fullName: fullName, email: email },
    },
    { new: true }
  ).select("-password -refreshToken");
  return res.status(200).json(new ApiResponse(200, user, "details updated"));
});
const changeAvatar = asyncHandler(async (req, res) => {
  const avatarPath = req.file?.path;
  if (!avatarPath) {
    throw new ApiError(400, "avatar is needed");
  }
  const avatar = await uploadOnCloudinary(avatarPath);
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { avatar: avatar.url },
    },
    { new: true }
  ).select("-password -refreshToken");
  res
    .status(200)
    .json(new ApiResponse(200, user, "avatar changed successfully"));
});
const changeCoverImage = asyncHandler(async (req, res) => {
  const coverImagePath = req.file?.path;
  if (!coverImagePath) {
    throw new ApiError(400, "coverImage is needed");
  }
  const coverImage = await uploadOnCloudinary(coverImagePath);
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { coverImage: coverImage.url },
    },
    { new: true }
  ).select("-password -refreshToken");
  res
    .status(200)
    .json(new ApiResponse(200, user, "coverImage changed successfully"));
});
export {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changePassword,
  changeDetails,
  changeAvatar,
  changeCoverImage,
};
