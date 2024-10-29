import mongoose from "mongoose";
const userHistorySchema=new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    reels:[
        {
            reel:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Reel",
                required:true
            },
            watchedAt:{
                type:Date,
                default:Date.now()
            }
        },
    ],
});
userHistorySchema.index({user:1});
export const  UserHistory=mongoose.model("UserHistory",userHistorySchema);
