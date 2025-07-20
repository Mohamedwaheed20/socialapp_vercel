 import mongoose  from "mongoose";
import mongoosePaginate  from "mongoose-paginate-v2";
 const postschema=new mongoose.Schema({
titel:{
    type:String,
    required:true
},
description:{
    type:String,
},
images:{
    urls:[{
        secure_url:String,
        public_id:String
    }],
    folder:String,
    },

owner_id:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
},

tags:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
}],

allowcomments:{
    type:Boolean,
    default:true
}

 },{timestamps:true,
     toJSON:{virtuals:true},
     toObject:{virtuals:true}
 })

 postschema.virtual("comments",{
    ref:"Comment",
    localField:"_id",
    foreignField:"commentonid"
 })
 postschema.plugin(mongoosePaginate)
 const Post= mongoose.models.Post || mongoose.model("Post",postschema)
 export default Post