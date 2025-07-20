import mongoose  from "mongoose";
const requestSchema = new mongoose.Schema({
    requeststby: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    pending: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    
    }],

},{timestamps:true})

 const Requestsmodel= mongoose.models.Requestsmodel || mongoose.model("Requestsmodel",requestSchema);
 export  {Requestsmodel}