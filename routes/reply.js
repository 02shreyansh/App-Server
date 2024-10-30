import express from "express";
import {
    createReply,
    deleteReply,
    getPaginatedReplies
} from "../controllers/feed/reply.js"
const replyRouter=express.Router()
replyRouter.post("/",createReply)
replyRouter.delete("/:replyId",deleteReply)
replyRouter.get("/",getPaginatedReplies)

export default replyRouter