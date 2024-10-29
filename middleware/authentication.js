import jwt from "jsonwebtoken";
import {UnauthenticatedError} from "../errors/index.js"
import {User} from "../models/index.js"
export const auth=async(req,res,next)=>{
    const authHeader=req.headers.authorization;
    if(!authHeader || !authHeader.startsWith("Bearer")){
        throw new UnauthenticatedError("Authentication invalid")
    }
    const token=authHeader.split(" ")[1];
    try {
        const payload=jwt.verify(token,process.env.ACCESS_TOKEN_SECRET)
        req.user={userId:payload.userId,name:payload.name};
        const user=await User.findById(payload.userId)
        if(!user){
            throw new UnauthenticatedError("User does not exist")
        }
        next()
    } catch (error) {
        throw new UnauthenticatedError("Authentication invalid");
    }

}