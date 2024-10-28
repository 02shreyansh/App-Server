import mongoose from "mongoose";
const likeSchema=new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    reel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Reel",
        required:true
    },
    comment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment",
    },
    reply:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Reply",
    }
},
    {timestamps:true}
);
likeSchema.index({reel:1});
likeSchema.index({comment:1});
likeSchema.index({reply:1});
export const  Like=mongoose.model("Like",likeSchema);