import express from "express"
const commentRouter=express.Router()
import {
    createComment,
    getPaginatedComments,
    deleteComment,
    markPin
} from "../controllers/feed/comment.js"

commentRouter.post("/",createComment)
commentRouter.delete("/:commentId",deleteComment)
commentRouter.post("/pin",markPin)
commentRouter.get("/",getPaginatedComments)

export default commentRouter