import express from "express";
const router=express.Router()
import {
    checkUsernameAvailability,
    refreshToken,
    signInWithOauth,
    signUpWithOauth
} from "../controllers/auth/auth.js"
router.post("/check-username",checkUsernameAvailability);
router.post("/login",signInWithOauth);
router.post("/register",signUpWithOauth);
router.post("/refresh-token",refreshToken)

export default router;