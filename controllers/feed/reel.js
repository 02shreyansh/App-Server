import jwt from "jsonwebtoken"
import {
    Reels as Reel,
    User,
    Like,
    Comment
} from "../../models/index.js"
import { StatusCodes } from "http-status-codes";
import {BadRequestError,NotFoundError} from "../../errors/index.js"

const createReel = async (req, res) => {
    const { videoUri, thumbUri, caption } = req.body;
    if (!videoUri || !thumbUri || !caption) {
      throw new BadRequestError("Invalid Body");
    }
    const accessToken = req.headers.authorization?.split(" ")[1];
  
    const decodedToken = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const userId = decodedToken.userId;
    const user = await User.findById(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    try {
      const newReel = new Reel({ user: userId, videoUri, caption, thumbUri });
      await newReel.save();
  
      res.status(StatusCodes.CREATED).json(newReel);
    } catch (error) {
      throw new BadRequestError(error);
    }
};
  
const getReelById = async (req, res) => {
    const { reelId } = req.params;
    const userId = req.user.userId;

    try {
        const reel = await Reel.findById(reelId)
            .populate("user", "username name userImage id")
            .select("-likes -comments");

        if (!reel) {
            throw new NotFoundError("Reel not found");
        }

        const likesCount = await Like.countDocuments({ reel: reelId });

        const commentsCount = await Comment.countDocuments({ reel: reelId });

        const user = await User.findById(userId);
        if (!user) {
            throw new NotFoundError("User not found");
        }
        const isFollowing = user.following.includes(reel.user._id.toString());

        const reelData = {
            _id: reel._id,
            videoUri: reel.videoUri,
            thumbUri: reel.thumbUri,
            caption: reel.caption,
            likesCount,
            commentsCount,
            user: {
                _id: reel.user.id,
                username: reel.user.username,
                name: reel.user.name,
                userImage: reel.user.userImage,
                isFollowing,
            },
            createdAt: reel.createdAt,
            updatedAt: reel.updatedAt,
        };

        res.status(StatusCodes.OK).json(reelData);
    } catch (error) {
        console.error(error);
        throw new BadRequestError(error);
    }
};
  
const deleteReel = async (req, res) => {
    const { reelId } = req.params;
    const accessToken = req.headers.authorization?.split(" ")[1];

    try {
        const decodedToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
        );
        const userId = decodedToken.userId;

        const reel = await Reel.findByIdAndDelete(reelId);
        if (!reel) {
            throw new NotFoundError("Reel not found");
        }

        if (reel.user._id.toString() !== userId) {
            throw new BadRequestError(
                "Unauthorized: You are not the owner of this reel"
            );
        }

        await reel.save()

        res.status(StatusCodes.OK).json({ msg: "Reel deleted successfully" });
    } catch (error) {
        console.error(error);
        throw new BadRequestError(error);
    }
};
const updateReelCaption = async (req, res) => {
    const { reelId } = req.params;
    const { caption } = req.body;
    const accessToken = req.headers.authorization?.split(" ")[1];

    try {
        const decodedToken = jwt.verify(
        accessToken,
        process.env.ACCESS_TOKEN_SECRET
        );
        const userId = decodedToken.userId;

        const reel = await Reel.findById(reelId);
        if (!reel) {
            throw new NotFoundError("Reel not found");
        }
        if (reel.user._id.toString() !== userId) {
            throw new BadRequestError(
            "Unauthorized: You are not the owner of this reel"
            );
        }
        reel.caption = caption;
        await reel.save();

        res.status(StatusCodes.OK).json(reel);
    } catch (error) {
        throw new BadRequestError(error);
    }
};
export {
    createReel,
    deleteReel,
    updateReelCaption,
    getReelById
}