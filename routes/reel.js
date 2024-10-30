import express from "express"
import {
    createReel,
    deleteReel,
    updateReelCaption,
    getReelById
} from "../controllers/feed/reel.js"
const reelRouter=express.Router()
reelRouter.post("/",createReel);
reelRouter.delete("/:reelId",deleteReel)
reelRouter.patch("/:reelId/caption",updateReelCaption)
reelRouter.get("/:reelId",getReelById)

export default reelRouter