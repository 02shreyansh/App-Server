import mongoose from "mongoose";
const replySchema=new mongoose.Schema({
    user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:true},
    comment:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Comment",
        required:true,
    },
    reel:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Reel",
        required:true,
    },
    reply:{
        type:String,
        maxLength:500,
    },
    likes:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Like"
        }
    ],
    mentionedUsers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    hasGif:{
        type:Boolean,
        default:false
    },
    isLikedByAuthor:{
        type:Boolean,
        default:false
    },
    gifUrl:{
        type:String
    },
    timestamp:{
        type:Date,
        default:Date.now
    }
});
replySchema.index({comment:1});
replySchema.index({user:1});
replySchema.index({likes:1});

export const  Reply=mongoose.model("Reply",replySchema);
