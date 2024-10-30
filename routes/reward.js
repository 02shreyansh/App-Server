import express from "express";
import {
    redeemTokens,
    getRewards,
    withdrawRupees
} from "../controllers/reward/reward.js"
const rewardRouter=express.Router()
rewardRouter.post("/redeem",redeemTokens);
rewardRouter.post("/withdraw",withdrawRupees)
rewardRouter.get("/",getRewards)
export default rewardRouter