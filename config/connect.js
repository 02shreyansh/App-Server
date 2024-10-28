import mongoose from "mongoose"
export const connectDB=async(uri)=>{
    try {
        const {connection}=await mongoose.connect(uri)
        console.log(`connected to ${connection.host}`)
    } catch (error) {
        console.log("Error in Connecting ",error)
    }
}