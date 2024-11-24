import {asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import jwt from 'jsonwebtoken';
import defineUserModel from '../models/user.models.js';

export const verifyJWT = asyncHandler(async (req,res,next) => {
    const User = await defineUserModel();
    try {
        let token = req.cookies?.accessToken || req.header("Authorization");
        console.log('Token recived',token);
        if(!token) {
            throw new ApiError(401,"Unauthorized request")
        }


        const decodedToken = jwt.verify(token,process.env.JWT_SECRET)

        const user = await User.findByPk(decodedToken.id)

        if(!user){
            throw new ApiError(401,"Invalid Access Token")
        }

        req.user = user;
        next();
    }catch (err){
        console.error("Error in verifyJWT:", err);
        throw new ApiError(401,err?.message || "Invalid Access Token");
    }
})