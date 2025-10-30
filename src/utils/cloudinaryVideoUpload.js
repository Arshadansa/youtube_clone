import { v2 as clodinary } from "cloudinary";
import { fs } from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_SECRET,
  api_secret: process.env.CLOUDINARY_API_KEY,
});

const uploadCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;
    const response = await clodinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });
    console.log("video file uploaded on cloudinary", response.url);
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath) // to unline localfiles which save on server
    return null;
  }
};


export {uploadCloudinary}