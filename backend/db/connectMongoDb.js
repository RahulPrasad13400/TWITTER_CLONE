import mongoose from "mongoose";

const connectMongoDb = async () =>{
    try{
        const conn = await mongoose.connect(process.env.MONGO_URI)
        console.log("Mongo db connection :",conn.connection.host)
    }catch(error){
        console.log("error connecting to mongo db : ", error.message )
        process.exit(1)
    }
}

export default connectMongoDb

