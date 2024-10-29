import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import {BadRequestError,NotFoundError} from "../../errors/index.js"
import {User,Reels} from "../../models/index.js"
import mongoose from "mongoose"

const getProfile=async(req,res)=>{
    const accessToken = req.headers.authorization?.split(" ")[1];
    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const userId=decodedToken.userId;
    const user=await User.findById(userId);
    if(!user){
        throw new NotFoundError("User not found")
    }
    try {
        const followersCount=await User.countDocuments({following:user._id});
        const followingCount=await User.countDocuments({followers:user._id});
        const reelsCount=await Reels.countDocuments({user:user._id});
        res.status(StatusCodes.OK).json({
            user:{
                name:user.name,
                id:user.id,
                username:user.userName,
                userImage:user.userImage,
                email:user.email,
                bio:user.bio,
                followersCount,
                followingCount,
                reelsCount
            }
        })
    } catch (error) {
        throw new BadRequestError(error);
    }
}
const viewUserByHandle=async(req,res)=>{
    const username=req.params.username;
    if(!username){
        throw new BadRequestError("Missing username in path parameter")
    }
    const user=await User.findOne({userName:username}).select("-followers -following");
    if(!user){
        throw new NotFoundError("User not found");
    }
    const followersCount=await User.countDocuments({following:user._id});
    const isFollowing=await User.countDocuments({
        following:user._id,
        _id:req.user.userId,
    });
    const followingCount=await User.countDocuments({followers:user._id})
    const reelsCount=await Reels.countDocuments({user:user._id})

    res.status(StatusCodes.OK).json({
        user:{
            id:user.id,
            username:user.userName,
            userImage:user.userImage,
            bio:user.bio,
            followersCount,
            followingCount,
            reelsCount,
            isFollowing:isFollowing>0,
        }
    });
};
const updateProfile=async(req,res)=>{

}
export {
    getProfile,
    viewUserByHandle,
    updateProfile
}