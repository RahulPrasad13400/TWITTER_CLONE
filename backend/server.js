import express from "express"
import dotenv from "dotenv"          // step 1 (env) ee rand step cheyuthale env file il ninn data access cheyyan patullu
import authRoutes from "./routes/auth.routes.js"
import connectMongoDb from "./db/connectMongoDb.js"

const app = express()
app.use(express.json())
app.use(express.urlencoded({extended : true}))       // to parase data from urlencoded (postman)

const PORT = process.env.PORT || 5000

dotenv.config() // step 2 (env) ee rand step cheyuthale env file il ninn data access cheyyan patullu

app.use("/api/auth", authRoutes)

app.listen(PORT,()=>{ 
    console.log("server is running on port",PORT)
    connectMongoDb()
})


