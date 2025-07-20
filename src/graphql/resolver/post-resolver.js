import Post from "../../db/models/post-models.js"
import { User } from "../../db/models/user_models.js"
import { authantication_middelware, graphauthantication_middelware } from "../../middelware/authantication-middelware.js"


export const listallpost=async()=>{
    const posts=await Post.find().populate(
        {
            path:"owner_id",
            select:"name email phone picture"
        },
    )
    return posts
}
export const createpost =async(args)=>{
    const accesstoken=args.accesstoken
    const user = await graphauthantication_middelware(accesstoken)
    if(user){
        return new Error("user not found")
    }
    const{titel,description,allowcomments,tags}=args

    if(tags){
        const user =await User.find({_id:{ $in:tags } })
        if(user.length!==tags.length){
            return new Error("invalid tags")
        }
    }

    const postobject=new Post({
        owner_id,
        titel,
        tags,
        description,
        allowcomments,
        
    })
   

    
    await Post.create(postobject)
    res.status(200).json({ message: "post added successfully" })
            return "create post resolver"
}