import "dotenv/config"
import "express-async-errors"

import express from "express";
import { connectDB } from "./config/connect.js";
import {
    notFound,
    errorHandlerMiddleware,
    authMiddleware
} from "./middleware/index.js";
// Routers
import authRouter from "./routes/auth.js";
import userRouter from "./routes/user.js";
import commentRouter from "./routes/comment.js";
import feedRouter from "./routes/feed.js";
import reelRouter from "./routes/reel.js";
import likeRouter from "./routes/like.js";
import replyRouter from "./routes/reply.js"
import rewardRouter from "./routes/reward.js"
import fileRouter from "./routes/file.js";
import shareRouter from "./routes/share.js";

const app=express();
app.use(express.json())

// Routers use
app.use("/oauth",authRouter)
app.use("/file",fileRouter)
app.use("/share",shareRouter)
app.use("/user",authMiddleware,userRouter);
app.use("/comment",authMiddleware,commentRouter)
app.use("/feed",authMiddleware,feedRouter)
app.use("/like",authMiddleware,likeRouter)
app.use("/reel",authMiddleware,reelRouter)
app.use("/reply",authMiddleware,replyRouter)
app.use("/reward",authMiddleware,rewardRouter)

// middleware
app.use(notFound);
app.use(errorHandlerMiddleware)

// start
const start=async()=>{
    const port =process.env.PORT || 3000
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
