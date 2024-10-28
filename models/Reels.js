import mongoose from "mongoose";
const reelsSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    videoUri:{
        type:String,
        required:true
    },
    thumbUri:{
        type:String,
        required:true
    },
    caption:{
        type:String,
        maxlength: 500 ,
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        }
    ],
    comments:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Comment"
        }
    ],
    viewCount:{
        type:Number,
        default:0
    }
},
    {timestamps:true}
);
reelsSchema.index({user:1});
reelsSchema.index({likes:1});
reelsSchema.index({comments:1});

export const Reels=mongoose.model("Reel",reelsSchema)