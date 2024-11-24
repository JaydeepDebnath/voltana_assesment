import {asyncHandler} from '../utils/asyncHandler.js';
import { ApiError } from "../utils/ApiError.js";
import  defineUserModel from '../models/user.models.js';
import {ApiResponse} from '../utils/ApiResponce.js';
import bcrypt from 'bcrypt';
import sendInvitationEmail from '../utils/emailService.js';
import {Op} from 'sequelize';
import Sequelize from 'sequelize';

import jwt from 'jsonwebtoken';


const generateAccessAndRefreshToken = async(userId) => {
    try {

        const User = await defineUserModel();

        const user = await User.findByPk(userId)
        
        if(!user) {
            throw new ApiError(404,"User not found");
        }

        const accessToken = jwt.sign(
            {id:user.id},
            process.env.JWT_SECRET,
            {expiresIn:'60m'}
        );

        const refreshToken = jwt.sign(
            {id:user.id},
            process.env.JWT_SECRET,
            {expiresIn:'7d'}
        );

        user.refreshToken = refreshToken;

        await user.save({validateBeforeSave:false});

        return {accessToken,refreshToken}
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating refresh and access token")
    }
}

const registerUser = asyncHandler(async (req,res) => {
    const {name,email,password,contactNumber,role } = req.body

    const User = await defineUserModel();

    if(
        [name,email,password,contactNumber,role].some((field => !field.trim()))
    ){
        throw new ApiError(400,"All fields are required")
    }

    const existedUser = await User.findOne({
       where:{
        [Sequelize.Op.or]: [{ email }, { contactNumber }]
       }
    })
    if(existedUser) {
        throw new ApiError(409,"User with this email or contact number already exists")
    }
    // console.log({...User})
    const hashedPassword = await bcrypt.hash(password,10);
   try {
     const user = await User.create({
         name,
         email,
         contactNumber,
         role,
         password:hashedPassword,
     })
 
     // console.log({...user})
 
     const createdUser = await User.findByPk(user.id,{
            attributes:{exclude:['password','refreshToken']}
     });
 
     if(!createdUser){
         throw new ApiError(500,"Something went wrong while registering user")
     }
 
   } catch (error) {
        throw new ApiError(500,error.message)
   }
    return res
    .status(201)
    .json(
        new ApiResponse(200,"User registered successfully")
    )
})

const loginUser = asyncHandler(async(req,res) => {
    const {email,contactNumber,password} = req.body;

    if (!password) {
        throw new ApiError(400, "Password is required");
    }

    const User = await defineUserModel();

    if(!email && !contactNumber){
        throw new ApiError(400,"Email or Contact Number is required")
    }

    const user = await User.findOne({
        where:{
            [Sequelize.Op.or]:[{email},{contactNumber}]
        },
        attributes:{exclude:['refreshToken']}
    });

    if(!user){
        throw new ApiError(404,"User does not exsists")
    }

    if (!user.password) {
        throw new ApiError(404, "Password not found for the user");
    }

    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        throw new ApiError(401,"Invalid user credentials")
    }

    const {accessToken,refreshToken} = await generateAccessAndRefreshToken(user.id)

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
            user: { id: user.id, name: user.name, email: user.email },
            accessToken,
             refreshToken
         },
         "User logged in sucessfully"
     )
    )
})

const logoutUser = asyncHandler(async (req,res)=>{
    const User = await defineUserModel();
    const [updateCount] = await User.update(
        {refreshToken:null},
        {
            where:{
                id:req.user.id
            }
        }
    );

    if(updateCount === 0){
        throw new ApiError(400, "User not found or unable to update refresh token");
    }

    const options = {
        httpOnly : true,  
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
            id: decodedToken.id
        }
    });

    if (!user) {
        throw new ApiError(401, "User not found or invalid refresh token");
    }

    if (incomingRefreshToken !== user.refreshToken) {
        throw new ApiError(401, "Refresh token is expired or invalid");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user.id);
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
                { accessToken, refreshToken: refreshToken },
                "Access token refreshed successfully"
            )
        );
})

const getAllUsers = asyncHandler(async (req,res) => {
    const User = await defineUserModel();
    
    const user = await User.findAll({
        attributes:{exclude:['password']}
    });

    if(!user || user.length === 0){
        throw new ApiError(404,"No users found");
    }

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            user,
            "All users fetched sucessfully"
        )
    );
});

const updateAccountDetails = asyncHandler(async (req,res) =>{
    const {name,email,contactNumber,role} = req.body;

    const User = await defineUserModel();

    if(!contactNumber && !email){
        throw new ApiError(400,"Contact Number or Email is required")
    }

    const updateFields = {};
    if(contactNumber)updateFields.contactNumber = contactNumber;
    if(email)updateFields.email = email;
    if(name)updateFields.name = name;
    if(role)updateFields.role = role;

    const [updateRowCount,updateUser] = await User.update(updateFields,{
        where:{id:req.user.id},
        returning: true,
    });

    if(updateRowCount === 0){
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
    const { email} = req.body;
    const User = await defineUserModel();

    if(!email ){
        throw new ApiError(400,"Email is reequired")
    }

    const existingUser = await User.findOne({
        where: { email }
    });

    if (existingUser) {
        throw new ApiError(400, "User with this email already exists");
    }

    const token = jwt.sign({email},process.env.JWT_SECRET,{expiresIn: '24h'})

    await User.create({
        email,
        invitationToken:token,
    });

    const inviteLink = `${process.env.FRONTEND_URL}/set-password?token=${token}`
    await sendInvitationEmail(email,inviteLink);
    return res
    .status(201)
    .json(
        new ApiResponse(
            201,
            "Invitation sent successfully. Check your email to set your password."
        )
    );

})

const setPassword = asyncHandler(async (req,res) => {
    const { token,password }= req.body;

    let decodedToken;

    try {
        decodedToken = jwt.verify(token,process.env.JWT_SECRET);
    } catch (error) {
        throw new ApiError(400, "Invalid or expired token."); 
    }

    const User = await defineUserModel();

    const user = await User.findOne({
        where:{
            email:decodedToken.email
        }
    })

    if(!user){
        throw new ApiError(404,"User not found");
    }

    const hashedPassword = await bcrypt.hash(password,10)

    user.password = hashedPassword;
    await user.save();

    return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            "Password set successfully. You can now log in."
        )
    )
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
    setPassword
}