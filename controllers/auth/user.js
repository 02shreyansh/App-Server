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
    const accessToken=req.headers.authorization?.split("  ")[1];
    const decodedToken=jwt.verify(accessToken,process.env.ACCESS_TOKEN_SECRET);
    const userId=decodedToken.userId;
    const user=await User.findById(userId);
    if(!user){
        throw new NotFoundError("User not found");
    }
    const { name, bio, userImage } = req.body;
    if(!name || !bio || userImage){
        throw new BadRequestError("No Update Fields provided");
    }
    try {
        if(name) user.name=name;
        if(bio) user.bio=bio;
        if(userImage) user.userImage=userImage;
        await user.save()
    } catch (error) {
        throw new BadRequestError(error);
    }
}
const toggleFollowing=async(req,res)=>{
    const accessToken = req.headers.authorization?.split(" ")[1];
    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const userId = decodedToken.userId;
    const  targetUserId = req.params.userId;
    if (!targetUserId) {
        throw new BadRequestError("Missing target user ID");
    }
    const targetUser=await User.findById(targetUserId)
    if(!targetUser){
        throw new NotFoundError("User not found");
    }
    const currentUser = await User.findById(userId);
    if (!currentUser) {
        throw new NotFoundError("User not found");
    }
    try {
        const isFollowing = currentUser.following.includes(targetUserId); 
        if (isFollowing) {
            currentUser.following.pull(targetUserId);
            targetUser.followers.pull(userId);
        }
        else{
            currentUser.following.push(targetUserId);
            targetUser.followers.push(userId)
        }
        await currentUser.save();
        await targetUser.save();
        res.status(StatusCodes.OK).json({
            msg: isFollowing ? "Unfollowed" : "Followed"
        })
    } catch (error) {
        throw new BadRequestError(error); 
    }
}
const getFollowers=async(req,res)=>{
    const userId = req.params.userId;
    const currentUserId = req.user.userId;
    const searchText = req.query.searchText;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
    if (!userId) {
        throw new BadRequestError("Missing user ID in query parameter");
      
    }
    const user=await User.findById(userId)
    if(!user){
        throw new NotFoundError("User not found");
    }
    const followers=await User.aggregate([
        {
            $match:{
                _id: { $in: user.followers },
                $or:[
                    {name:{
                        $regex:searchText,
                        $options:"i"
                    }},
                    { username: { $regex: searchText, $options: "i" } },
                ],
            },
        },
        {
            $addFields:{
                isFollowing: { $in: [currentUserId, "$following"] },
            },
        },
        {
            $project:{
                name: 1,
                username: 1,
                userImage: 1,
                id: 1,
                isFollowing: 1,
            },
        },
        {
            $sort:{
                isFollowing:-1,
            },
        },
        {
            $skip:offset,
        },
        {
            $limit:limit
        }
    ]);
    res.status(StatusCodes.OK).json(followers)
}
const getFollowing = async (req, res) => {
    const userId = req.params.userId;
    const currentUserId = new mongoose.Types.ObjectId(req.user.userId);
    const searchText = req.query.searchText;
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;
  
    if (!userId) {
      throw new BadRequestError("Missing user ID in query parameter");
    }
  
    const user = await User.findById(userId);
  
    if (!user) {
      throw new NotFoundError("User not found");
    }
  
    const following = await User.aggregate([
      {
        $match: { _id: { $in: user.following } },
      },
      {
        $addFields: {
          isFollowing: { $in: [currentUserId, "$followers"] },
        },
      },
      {
        $match: {
          $or: [
            { name: { $regex: searchText, $options: "i" } },
            { username: { $regex: searchText, $options: "i" } },
          ],
        },
      },
      {
        $project: {
          name: 1,
          username: 1,
          userImage: 1,
          id: 1,
          isFollowing: 1,
        },
      },
      {
        $sort: {
          isFollowing: -1,
        },
      },
      {
        $skip: offset,
      },
      {
        $limit: limit,
      },
    ]);
  
    res.status(StatusCodes.OK).json(following);
};
const getUsersBySearch = async (req, res) => {
    const searchText = req.query.text;
    const limit = parseInt(req.query.limit) || 10;
    const userId = req.user.userId;
    let searchQuery = {};
  
    if (searchText) {
      searchQuery = {
        $or: [
          { name: { $regex: searchText, $options: "i" } },
          { username: { $regex: searchText, $options: "i" } },
        ],
      };
    }
  
    let users = await User.aggregate([
      {
        $match: searchQuery,
      },
      {
        $addFields: {
          isFollowing: { $in: [userId, "$followers"] },
        },
      },
      {
        $match: {
          _id: { $ne: userId },
        },
      },
      {
        $project: {
          _id: 1,
          username: 1,
          userImage: 1,
          name: 1,
        },
      },
      {
        $sort: {
          isFollowing: -1,
          createdAt: -1,
        },
      },
      {
        $limit: limit,
      },
    ]);
    res.status(StatusCodes.OK).json({ users });
};
export {
    getProfile,
    viewUserByHandle,
    updateProfile,
    toggleFollowing,
    getFollowers,
    getFollowing,
    getUsersBySearch
}