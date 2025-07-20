import mongoose from "mongoose";

export const database_connect =async()=>{
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("database connected!");
        
    } catch (error) {
        console.log(error);
        
    }
}
