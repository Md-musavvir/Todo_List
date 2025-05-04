import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import ApiError from "./ApiError";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});
const uploadOnCloudinary = async (localpath) => {
  try {
    if (!localpath) {
      throw new ApiError(404, "local path missing");
    }
    const response = await cloudinary.uploader.upload(localpath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localpath);
    return response;
  } catch (error) {
    throw new ApiError(500, "something went wrong while uploading");
  }
};
export default uploadOnCloudinary;
