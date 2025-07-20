import { reacts } from "../../../constants/constants.js";
import Comment from "../../../db/models/comment.models.js";
import Post from "../../../db/models/post-models.js";
import React from "../../../db/models/reacts-models.js";




export const addreact=async(req,res,next)=>{
    try {
       const{_id:owner_id}=req.authuser;
       const {reactionid}=req.params;
       const {reactiontype,onmodel}=req.body;
       if(onmodel=="Post")
        {
            const post=await Post.findById(reactionid);
            if(!post)
            {
                return res.status(400).json({ message: "post not allowed" })
            }
        }
    
        else if(onmodel=="Comment")
        {
            const comment=await Comment.findById(reactionid);
            if(!comment)
            {
                return res.status(400).json({ message: "comment not found" })
            }
        }

        const Reacts=Object.values(reacts)
        if(!Reacts.includes(reactiontype))
        {
            return res.status(400).json({ message: "invalid reaction type" })
        }
    
        const reactobject=await React.create({
            reactionid,
            onmodel,
            reactiontype,
            owner_id   
         }
            );
            res.status(200).json({ message: "react added", reactobject })
            }
             catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}

export const deletereact=async(req,res,next)=>{
    try {
        const{_id:owner_id}=req.authuser;
        const {reactionid}=req.params;
        const deletereact=await React.findOneAndDelete({
            
        _id:reactionid,
        owner_id
        });
        if(!deletereact)
        {
            return res.status(400).json({ message: "react not found" })
        }
        res.status(200).json({ message: "react deleted", reactobject })
        }
         catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}