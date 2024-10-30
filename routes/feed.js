import express from "express"
import {
    getHomeFeed,
    getLikedVideos,
    getAllHistoryReels,
    markReelsWatched,
    getReelPosts
} from "../controllers/feed/feed.js"
const feedRouter=express.Router()
feedRouter.get("/watchedreel/:userId",getAllHistoryReels);
feedRouter.get("/likedreel/:userId",getLikedVideos);
feedRouter.get("/reel/:userId",getReelPosts);
feedRouter.get("/markwatched",markReelsWatched);
feedRouter.get("/home",getHomeFeed)

export default feedRouter