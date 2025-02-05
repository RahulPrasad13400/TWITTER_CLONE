import express from "express"
import dotenv from "dotenv"          // step 1 (env) ee rand step cheyuthale env file il ninn data access cheyyan patullu

import authRoutes from "./routes/auth.route.js"
import userRoutes from "./routes/user.route.js"
import postRoutes from "./routes/post.route.js"
import notificationRoutes from "./routes/notification.route.js"

import connectMongoDb from "./db/connectMongoDb.js"
import cookieParser from "cookie-parser"   // to get cookie
import { v2 as cloudinary } from "cloudinary"       // to setup the cloudinary

const app = express()
app.use(express.json())
app.use(cookieParser()) // to get cookie 
app.use(express.urlencoded({extended : true}))       // to parase data from urlencoded (postman)

const PORT = process.env.PORT || 5000

dotenv.config() // step 2 (env) ee rand step cheyuthale env file il ninn data access cheyyan patullu

// to setup the cloudinary
cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME ,
    api_key : process.env.CLOUDINARY_API_KEY ,
    api_secret : process.env.CLOUDINARY_API_SECRET
})

app.use("/api/auth", authRoutes)
app.use("/api/users",userRoutes)
app.use("/api/posts", postRoutes)
app.use("/api/notifications", notificationRoutes)

app.listen(PORT,()=>{ 
    console.log("server is running on port",PORT)
    connectMongoDb()
})


