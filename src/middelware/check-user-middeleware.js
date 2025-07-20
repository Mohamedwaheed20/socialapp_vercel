import { User } from "../db/models/user_models.js";


export const checkuser=async(req,res,next)=>{

    let {tags}=req.body
    if(!Array.isArray(tags)){
tags=[tags] 
    }

    if(tags?.length){
        const users=await User.find({ _id: { $in:tags } });
        if((tags?.length!==users?.length)){
            return res.status(400).json({ message: "invalid tags" })
        }
    }
  next()
    }
