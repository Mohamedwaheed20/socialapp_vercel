 import mongoose from "mongoose";

 export const friendschema=new mongoose.Schema({
     user_id:{
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true
     },
     friends:{
         type: mongoose.Schema.Types.ObjectId,
         ref: "User",
         required: true
     },
    
 },)

 const Friends= mongoose.models.Friends || mongoose.model("Friends",friendschema);
 export default Friends