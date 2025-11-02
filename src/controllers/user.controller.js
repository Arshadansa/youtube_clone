import asyncHandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiErros.js";
import { User } from "../models/user.model.js";
import { uploadCloudinary } from "../utils/cloudinaryVideoUpload.js";
import { ApiResponse } from "../utils/apiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - check field are not empty
  // check if user already exist or not
  // check images for avatar
  // upload them in cloudinary,avatar
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check user created..?
  // send/return res

  const { email, username, fullname, password } = req.body;

  if ([fullname, username, email, password].some((field) => {
      field?.trim() === "";
    })) 
  {
    throw new apiError(400, "All fields are Required");
  }

  const existingUser = await User.findOne({
    $or: [{ username, email }],
  });

  if (existingUser) {
    throw new apiError(409, "User with email or username already exists");
  }

  
  const avatarLocalPath = req.files?.avatar[0]?.path;
  console.log("file path-----", req.files?.avatar[0]?.path);
  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar is required");
  }
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  const avatar = await uploadCloudinary(avatarLocalPath);
  const coverImage = await uploadCloudinary(coverImageLocalPath);
 console.log("file path-----", req.files?.avatar[0]?.path);
  if (!avatar) {
    throw new apiError(400, "Avatar is required");
  }
  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new apiError(500, "somthing went wrong while creating user in db");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "user registered successfully"));
});

export { registerUser };
