import mongoose from "mongoose";

export const chatmesssageSchema=new mongoose.Schema({
    sender_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reciever_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message:[{
     body:{
        type: String,
        required: true
     },
   sender_id:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
   },
   sent_at:{
    type: Date,
    default: Date.now
    },
 } ] 
}
,{timestamps:true});

const ChatMessage= mongoose.models.ChatMessage || mongoose.model("ChatMessage",chatmesssageSchema);
export default ChatMessage