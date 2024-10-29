import { StatusCodes } from "http-status-codes";
export const errorHandlerMiddleware=(err,req,res,next)=>{
    let CustomError={
        statusCode:err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
        msg:err.message ||  'Something went wrong try again later',
    }
    if(err.name==="ValidationError"){
        CustomError.msg=Object.values(err.errors).map((item)=>item.message).join(",");
        CustomError.statusCode=400;
    }
    if(err.code && err.code === 11000){
        CustomError.msg=`Duplicate value entered for ${Object.keys(err.keyValue)} field, please choose another value`;
        CustomError.statusCode=400;
    }
    if(err.name ==="CastError"){
        CustomError.msg=`No item found with id : ${err.value}`
        CustomError.statusCode=404
    }
    return res.status(CustomError.statusCode).json({
        success:false,
        msg:CustomError.msg
    })
}