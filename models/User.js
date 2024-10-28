import mongoose from "mongoose";
const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        match:[
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
        "Please provide a valid email",
        ],
        unique:true
    },
    userName:{
        type:String,
        required:true,
        match:[
            /^[a-zA-Z0-9_]{3,30}$/, "Please provide a valid username"
        ],
        unique:true
    },
    name:{
        type:String,
        maxlength: 50,
        minlength: 3,
    },
    userImage:{
        type:String,
    },
    bio:{
        type:String,
    },
    followers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    following:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ]

},
    {timestamps:true}
);
userSchema.index({followers:1});
userSchema.index({following:1});
export const User=mongoose.model("User",userSchema)