import express from "express"
import Share from "../controllers/share/share.js"
const shareRouter=express.Router()
shareRouter.get("/:type/:id", Share);

export default shareRouter