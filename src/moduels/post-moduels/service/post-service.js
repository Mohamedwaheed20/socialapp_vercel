/**
 * create post
 * @param {object} req
 * @param {object} res
 * @returns {promise<response>} 
 * create post for user
 */


import { nanoid } from "nanoid";
import { User } from "../../../db/models/user_models.js";
import { cloudinaryConfig } from "../../../config/cloudnariy.js";
import Post from "../../../db/models/post-models.js";
import { pagnation } from "../../../utils/pagnation.js";

export const addpostservice=async(req,res,next)=>{
    try {
        const{_id:owner_id}=req.authuser;
        const{titel,description,allowcomments,tags}=req.body

        const postobject=new Post({
            owner_id,
            titel,
            tags,
            description,
            allowcomments,
            
        })
       

        //images
        let images=null 
        if(req.files?.length){
            const folder=nanoid(4)
           images={
                urls:[],
                folder
            }
            for(const file of req.files){
                const {secure_url,public_id}=await cloudinaryConfig().uploader.upload(file.path,{
                    folder:`${process.env.cloudnary_folder}/post/${folder}`
                })
                images.urls.push({secure_url,public_id})
            }
            postobject.images=images
        }
        const post=await Post.create(postobject)
        res.status(200).json({ message: "post added successfully", post })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}

export const listpost=async(req,res,next)=>{
    const {page,limit}=req.query
    // const {skip,limit:limitcalc}=pagnation(page,limit)


    try {
        // const posts=await (await Post.find().limit(limitcalc)).skip(skip).sort({createdAt:-1})
        //     res.status(200).json({ message: "posts", posts })

        const posts = await Post.find().paginate(
            {
                limit,
                page,
                sort:{createdAt:-1}
            }
        )

        res.status(200).json({ message: "posts", posts })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
        
    }

}