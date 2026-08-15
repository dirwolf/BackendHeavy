import {User} from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
// import { generateAccessAndRefereshTokens } from "../utils/token.util.js";

export const createUser = async ({ fullName, email, username, password, avatarLocalPath, coverImageLocalPath }) => {
  if (!avatarLocalPath) throw new ApiError(400, "Avatar file is required");

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = coverImageLocalPath ? await uploadOnCloudinary(coverImageLocalPath) : null;

  if (!avatar?.url) throw new ApiError(400, "Failed to upload avatar");

  const user = await User.create({
    fullName,
    avatar: avatar.url,
    coverImage: coverImage?.url || "",
    email,
    password,
    username: username.toLowerCase(),
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");
  if (!createdUser) throw new ApiError(500, "Something went wrong while registering the user");

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();

  user.refreshToken=refreshToken;

  await user.save(
    {
        validateBeforeSave : false
    }
  )



//   const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

  return { user: createdUser, accessToken, refreshToken };
};