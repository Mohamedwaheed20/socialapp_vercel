import { nanoid } from "nanoid";
import Post from "../../../db/models/post-models.js";
import { User } from "../../../db/models/user_models.js";
import { cloudinaryConfig } from "../../../config/cloudnariy.js";
import Comment from "../../../db/models/comment.models.js";

  

export const addcommentservice=async(req,res,next)=>{
    try {
        const{_id:owner_id}=req.authuser;
        const{content,tags,onmodel}=req.body
      const {commentonid}=req.params

const commentobject=
{
    content,
    owner_id,
    tags
    
}
console.log(onmodel);

if(onmodel=="Post")
    {
        console.log(commentonid)
        const post=await Post.findOne({_id:commentonid,allowcomments:true});
        console.log(post)
        if(!post)
        {
            return res.status(400).json({ message: "comment not alloweddddddddd" })
        }
    }

    else if(onmodel=="Comment")
    {
        const comment=await Comment.findById(commentonid);
        if(!comment)
        {
            return res.status(400).json({ message: "comment not found" })
        }
    }
    commentobject.commentonid=commentonid
    commentobject.onmodel=onmodel
    if(req.files?.length){
        const folder=nanoid(4)
       let images={
            urls:[],
            folder
        }
        for(const file of req.files){
            const {secure_url,public_id}=await cloudinaryConfig().uploader.upload(file.path,{
                folder:`${process.env.cloudnary_folder}/post/${folder}`
            })
            images.urls.push({secure_url,public_id})
        }
        commentobject.images=images
    }
const comment=await Comment.create(commentobject);
if(comment)
{
    res.status(200).json({ message: "comment added successfully", comment })
}
}
     catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}  



export const listcommentservice=async(req,res,next)=>{
    try {
        const comment =await Comment.find().populate(
            [
                {
                    path:"commentonid",
               // select:"username "
               populate:{
                path:"owner_id",
               select:"username "
                },  
            }
            ])
            
            res.status(200).json({ message: "comments", comment })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
        
    }
}