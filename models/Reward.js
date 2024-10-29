import mongoose from "mongoose";
const rewardSchema=new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    tokens:{
        type:Number,
        default:0
    },
    rupees:{
        type:Number,
        default:0
    }
})
export const Reward=mongoose.model("Reward",rewardSchema)