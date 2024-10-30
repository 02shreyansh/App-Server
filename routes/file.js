import express from "express"
import upload from "../config/mutler.js"
import uploadMedia from "../controllers/file/upload.js"
const fileRouter=express.Router()

fileRouter.post("/upload",upload.single("image"),uploadMedia)
export default fileRouter