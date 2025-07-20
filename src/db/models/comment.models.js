
 import mongoose from 'mongoose';
 const commentschema=new mongoose.Schema({
content:{
    type:String,
},
owner_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
},
tags:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
},
images:{
    urls:[{
        secure_url:String,
        public_id:String
    }],
    folder:String,
    },
    commentonid:{
        type:mongoose.Schema.Types.ObjectId,
        refpath:"onmodel",
        required:true
    },
    onmodel:{
        type:String,
        enum:["Post","Comment"],
      
    }

 },{timestamps:true})
 


 const Comment= mongoose.models.Comment || mongoose.model("Comment",commentschema)
  export default Comment