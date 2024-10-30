import express from "express"
import {
    getProfile,
    updateProfile,
    viewUserByHandle,
    getFollowers,
    getFollowing,
    getUsersBySearch,
    toggleFollowing
} from "../controllers/auth/user.js"
const userRouter=express.Router()

userRouter.route("/profile").get(getProfile).patch(updateProfile);
userRouter.put("/follow/:userId",toggleFollowing);
userRouter.get("/profile/:username",viewUserByHandle)
userRouter.get("/followers/:userId",getFollowers)
userRouter.get("/following/:userId",getFollowing)
userRouter.get("/search",getUsersBySearch)

export default userRouter