import {ApiError} from '../utils/apiError.js';
import {asyncHandler } from '../utils/asyncHandler.js';
import jwt from 'jsonwebtoken';
import  User  from '../models/user.models.js';

export const verifyJWT = asyncHandler(async (req,res,next) => {
    try {
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
        
        if(!token) {
            throw new ApiError(401,"Unauthorized request")
        }

        const decodedToken = jwt.verify(token,process.env.JWT_SECRET)

        const user = await User.findOne({where:{id:decodedToken._id }})

        if(!user){
            throw new ApiError(401,"Invalid Access Token")
        }

        req.user = user;
        next();
    }catch (err){
        throw new ApiError(401,err?.message || "Invalid Access Token")
    }
})