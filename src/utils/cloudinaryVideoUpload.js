import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,    
  api_secret: process.env.CLOUDINARY_SECRET,   
});

const uploadCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    // Upload to Cloudinary
    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    console.log("✅ File uploaded to Cloudinary:", response.secure_url);

    // ✅ Safely delete the local file after upload
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

     return {
      url: response.secure_url,
      public_id: response.public_id,
    };;

  } catch (error) {
    console.error("❌ Cloudinary upload error:", error.message);

    // ✅ Attempt cleanup safely
    try {
      if (fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
    } catch (unlinkErr) {
      console.warn("⚠️ Failed to delete local file:", unlinkErr.message);
    }

    return null;
  }
};

export { uploadCloudinary };
