import express from "express"
import {
    likeComment,
    likeReel,
    likeReply,
    listLikes
} from "../controllers/feed/like.js"
const likeRouter=express.Router()
likeRouter.post("/comment/:commentId",likeComment)
likeRouter.post("/reply/:replyId",likeReply)
likeRouter.post("/reel/:reelId",likeReel);
likeRouter.get("/",listLikes)
export default likeRouter