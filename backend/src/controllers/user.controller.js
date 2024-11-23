import {asyncHandler} from '../utils/asyncHandler.js';
import { ApiError } from "../utils/ApiError.js";
import  defineUserModel from '../models/user.models.js';
import {ApiResponse} from '../utils/ApiResponce.js';

import jwt from 'jsonwebtoken';


const generateAccessAndRefreshToken = async(userId) => {
    try {

        const User = await defineUserModel();

        const user = await User.findOne({ where: { id: userId } })
        
        if(!user) {
            throw new ApiError(404,"User not found");
        }

        const accessToken = jwt.sign(
            {_id:user.id},
            process.env.JWT_SECRET,
            {expiresIn:'15m'}
        );

        const refreshToken = jwt.sign(
            {_id:user.id},
            process.env.JWT_SECRET,
            {expiresIn:'7d'}
        );

        user.refreshToken = refreshToken;

        await user.save({validateBEforeSave:false});

        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler(async (req,res) => {
    const {id,username,email,password,contactNumber,role } = req.body

    const User = await defineUserModel();

    if(
        [id,username,email,password,contactNumber,role].some((field) => field?.trim() === "")
    ){
        throw new ApiError(400,"All fields are required")
    }

    const existedUser = await User.findOne({
        $or:[{username},{email}]
    })
    if(existedUser) {
        throw new ApiError(409,"User with this email already exsists")
    }

    const hashedPassword = await bcrypt.hash(password,10);

    const user = await User.create({
        id,
        username:username.toLowerCase(),
        email,
        contactNumber,
        role,
        password:hashedPassword,
    })


    const createdUser = await User.findOne(user.id).select(
        "-password -refreshToken"
    )

    if(!createdUser){
        throw new ApiError(500,"Something went wrong while registering user")
    }

    return res
    .status(201)
    .jsion(
        new ApiResponse(200,"User registered successfully")
    )
})

const loginUser = asyncHandler(async(req,res) => {
    const {email,username,password} = req.body

    const User = await defineUserModel();

    if(!username && !email){
        throw new ApiError(400,"Username or [assword is required")
    }

    const user = await User.findOne({
        where:{
            [Op.or]:[{username},{email}]
        }
    });

    if(!user){
        throw new ApiError(404,"User does not exsists")
    }
    const isPasswordValid = await  user.isPasswordCorrect(password)
    if(!isPasswordValid){
        throw new ApiError(401,"Invalid user credentials")
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user.id)
    .select("-password refreshToken")

    const options = {
        httpOnly : true,
        secure:true,
    }

    return res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .cookie("refreshToken",refreshToken,options)
    .json(
     new ApiResponse(
         200,{
             user : loggedInUser,accessToken,
             refreshToken
         },
         "User logged in sucessfully"
     )
    )
})

const logoutUser = asyncHandler(async (req,res)=>{
    const User = await defineUserModel();
    const [update] = await User.update(
        {refreshToken:null},
        {
            where:{
                id:req.user.id
            }
        }
    );

    if(update === 0){
        throw new ApiError(400, "User not found or unable to update refresh token");
    }

    const options = {
        httpOnly : true,    // cookies only modifieble by db,could not from frontend 
        secure : true
       }

       return res
       .status(200)
       .clearCookie("accessToken",options)
       .clearCookie("refreshToken",options)
       .json(new ApiResponse(200,{},"User logged out"))
})

const refreshAccessToken = asyncHandler(async(req,res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    
    const User = await defineUserModel();

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Invalid request: No refresh token provided");
    }

    let decodedToken;
    try {
        decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    } catch (error) {
        throw new ApiError(401, "Invalid refresh token");
    }
    const user = await User.findOne({
        where: {
            id: decodedToken._id
        }
    });

    if (!user) {
        throw new ApiError(401, "User not found or invalid refresh token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
        throw new ApiError(401, "Refresh token is expired or invalid");
    }

    const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user.id);
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
                "Access token refreshed successfully"
            )
        );
})

const getAllUsers = asyncHandler(async (req,res) => {
    const User = await defineUserModel();
    
    const users = await User.findAll({
        attributes:{exclude:['password']}
    });

    if(!users || users.length === 0){
        throw new ApiError(404,"No users found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            users,
            "All users fetched sucessfully"
        )
    );
});

const updateAccountDetails = asyncHandler(async (req,es) =>{
    const {username,email} = req.body;

    const User = await defineUserModel();

    if(!username && !email){
        throw new ApiError(400,"Full Name or Email is required")
    }

    const updateFields = {};
    if(contactNumber)updateFields.contactNumber = contactNumber;
    if(email)updateFields.email = email;
    if(username)updateFields.username = username;
    if(role)updateFields.role = role;

    const [updateROwCount,updateUser] = await User.update(updateFields,{
        where:{id:req.user.id},
        returning: true,
    });

    if(updateROwCount === 0){
        throw new ApiError(404,"User not found or no fields updated")
    }

const updateUserData = updateUser[0].get();
delete updateUserData.password;

return res
.status(200)
.json(
    new ApiResponse(
        200,
        updateUserData,
        "Account details updated successfully"
    )
);
})

const deleteUser = asyncHandler(async (req,res) => {
    const User = await defineUserModel();
    const userId = req.user.id;

    const deleteUserCount = await User.destroy({
        where:{id:userId},
    });

    if(deleteUserCount === 0){
        throw new ApiError(404,"User not found or already deleted")
    }
    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            {},
            "User account deleted successfully"
        )
    )
})

const inviteNewUser = asyncHandler(async(req,res) => {
    const { username,email,password,role } = req.body;
    const User = await defineUserModel();

    if(!username || !email || !password || !role){
        throw new ApiError(400,"Username,email,role and password is reequired")
    }

    const existingUser = await User.findOne({
        where: { email }
    });

    if (existingUser) {
        throw new ApiError(400, "User with this email already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        fullName,
        email,
        password: hashedPassword 
    });

    const newUserData = newUser.get();
    delete newUserData.password;

    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            newUserData,
            "New user invited successfully"
        )
    );

}) 


export {
    generateAccessAndRefreshToken,
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken,
    getAllUsers,
    updateAccountDetails,
    deleteUser,
    inviteNewUser,
}