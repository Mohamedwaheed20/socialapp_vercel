import { User } from "../../../db/models/user_models.js";
import { cloudinaryConfig } from "../../../config/cloudnariy.js";
import { nanoid } from "nanoid";
import { Requestsmodel } from "../../../db/models/requests.js";
import Friends from "../../../db/models/friends-model.js";

export const uploadimage = async (req, res, next) => {
    try {
        const { _id } = req.authuser;

        const { file } = req
        if (!file) {
            return res.status(400).json({ message: "image is required" });
        }
        const url = `${req.protocol}://${req.headers.host}/${file.path}`
        const user = await User.findByIdAndUpdate(_id, { profilePicture: url }, { new: true });
        res.status(200).json({ message: "image uploaded successfully", user })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}


export const uploadcover = async (req, res, next) => {
    try {
        const { _id } = req.authuser;
        const { files } = req
        if (!files?.length) {
            return res.status(400).json({ message: "image is required" });
        }
        const images = files.map(file => `${req.protocol}://${req.headers.host}/${file.path}`);

        const user = await User.findByIdAndUpdate(_id, { coverPicture: images }, { new: true });
        res.status(200).json({ message: "image uploaded successfully", user })
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}


export const uploadimagecloud = async (req, res, next) => {
    try {
       const{_id}=req.authuser;
       const{file}=req
       if(!file)
       {
        return res.status(400).json({ message: "image is required" });
       }
       const folder=nanoid(4)
        const {secure_url,public_id}=await cloudinaryConfig().uploader.upload(file.path,{
            folder:`${process.env.cloudnary_folder}/user/profile${folder}`
        })
       const user = await User.findByIdAndUpdate(_id, { profilePicture:[{ secure_url,public_id,folder }] }, { new: true });
        res.status(200).json({ message: "image uploaded successfully", user })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}
export const uploadcovercloud = async (req, res, next) => {
    try {
       const{_id}=req.authuser;
       const{files}=req
       if(!files?.length)
       {
        return res.status(400).json({ message: "image is required" });
       }
       const folder=nanoid(4)

       const images=[]
       for(const file of files)
       {
        const {secure_url,public_id}=await cloudinaryConfig().uploader.upload(file.path,{
            folder:`${process.env.cloudnary_folder}/user/cover/${folder}`
        })
        images.push({ secure_url,public_id})
       }
       const user = await User.findByIdAndUpdate(_id, { coverPicture:images, folder }, { new: true });
        res.status(200).json({ message: "image uploaded successfully", user })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}


export const DeleteAccount = async (req, res) => {
    try {
    const { _id } = req.authuser;

    // Delete user from database
    const deletedUser = await User.findByIdAndDelete(_id);

    // Delete user profile picture from Cloudinary
    const profilePublicId = deletedUser.profilePicture.public_id;
    const coversPublicIds = deletedUser.coverPicture.map(c => c.public_id);

    // Delete one resource by public_id
    const data = await cloudinaryConfig().uploader.destroy(profilePublicId);
    console.log(data); // OK, not found

    // Delete multiple resources by public_ids
    const bulk = await cloudinaryConfig().api.delete_resources(coversPublicIds);
    console.log(bulk);

    res.status(200).json({ message: 'Account deleted successfully' });
    

    const deletedfolder=await cloudinaryConfig().api.delete_folder(`${process.env.cloudnary_folder}/user/cover`);
    console.log(deletedfolder);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
};



export const updateprofile=async(req,res,next)=>{
    try {
        const { _id } = req.authuser;
        const { username, email, password, phone  } = req.body;
        const user= new User({
            _id,
            username,
            email,
            password,
            phone
        })
        await user.updateOne();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}
export const getprofile=async(req,res,next)=>{
    try {
        const { _id } = req.authuser;
        const user= await User.findById(_id);
        res.status(200).json({ message: "user profile", user })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}


export const listusers=async(req,res,next)=>{
    try {
        const users= await User.find();
        res.status(200).json({ message: "user profile", users }) 
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}


export const sendrequest=async(req,res,next)=>{
    try {
    const{_id}=req.authuser;
    const{requesttoid}=req.params;
    const user=await  User.findById(requesttoid);

    if(!user)
    {
        return res.status(400).json({ message: "user not found" });
    }
    
    let request=null
    const requestexists=await Requestsmodel.findOne({requeststby:_id})
    if(requestexists)
    {
   const isrequestexists= requestexists.pending.includes(requesttoid)
if(isrequestexists){
    return res.status(400).json({ message: "you already sent a request" });
} 
requestexists.pending.push(requesttoid)
request=await requestexists.save()
        }else{
            const newrequest=new Requestsmodel({
                requeststby:_id,
                pending:[requesttoid]
            })
            request=await newrequest.save()
        }
        res.status(200).json({ message: "request sent", request })

    }
     catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}

export const AcceptFriendRequestService = async (req, res, next) => {
    try {
    const { _id } = req.authuser; // yasir
    const { requestFromId } = req.params; // amira

    const request = await Requestsmodel.findOneAndUpdate(
        { requeststby: requestFromId, pending: { $in: [_id] } },
        { $pull: { pending: _id } }
    );

    if (!request) {
        return res.status(404).json({ message: 'Request not found' });
    }

    let friend = null;
    const hasFriend = await Friends.findOne({ user_id: _id });

    if (hasFriend) {
        const isRequestExists = hasFriend.friends.includes(requestFromId);
        if (isRequestExists) {
            return res.status(400).json({ message: 'Friend already exists' });
        }

        hasFriend.friends.push(requestFromId);
        friend = await hasFriend.save();
    } else {
        const newFriend = new Friends({
            user_id: _id,
            friends: [requestFromId],
        });
        friend = await newFriend.save();
    }

    return res.status(200).json({ message: 'Friend request accepted successfully', friend });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
};
export const listfriend=async(req,res,next)=>{
    try {
        const { _id,username } = req.authuser;
        const friends = await Friends.findOne({ user_id: _id });
        if (!friends) {
            return res.status(404).json({ message: 'Friends not found' });
        }
        return res.status(200).json({message: "Friends found", friends,user:{_id,username} });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}