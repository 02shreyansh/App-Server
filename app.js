import "dotenv/config"
import express from "express";
import { connectDB } from "./config/connect.js";
const app=express();
const  port=process.env.PORT || 3000;

const start=async()=>{
    try {
        app.listen(port, () =>
            console.log(`HTTP server is running on port ${port}`)
        );
        await connectDB(process.env.MONGO_URL)
    } catch (error) {
        console.log(error);
    }
}
start()
