import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req,res) => {
    // take user details from frontend
    // validation - not empty , email should be in format
    // check if user already exists : username, email
    // check for images, check for avatar
    // uplaod them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation 
    // return res
    const {username, email, fullname, password} = req.body;
    //console.log("email : " , email);

    if (
        [fullname, email, username, password].some((field) => field?.trim() === "")

    ) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = User.findOne({
        $or : [{ username }, { email }]
    })

    if(existedUser) {
        throw new ApiError(409, "User with email or username already exists.");
    }

    const avatarLocalPath = req.files?.avatar[0]?.path;
    console.log(avatarLocalPath);
    const converImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400 , "Avatar file is required");
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(converImageLocalPath);

    if (!avatar) {
        throw new ApiError(400 , "Avatar file is required");
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage : coverImage.url || "",
        username : username.toLowerCase(),
        email,
        password
    })

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    );

    if (!createdUser) {
        throw new ApiError(500 , "Something went wrong while registering the user.")
    }

    return res.status(201).json(
        new ApiResponse(200 , createdUser , "User registered Successfully.")
        )
});




export { registerUser };