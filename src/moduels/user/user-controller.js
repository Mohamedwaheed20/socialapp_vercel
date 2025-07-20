
import { Router } from "express";
import *as authservice from './service/profile-shema.js';
import { multermiddelware, multermiddelwarehost } from "../../middelware/multer-middelware.js";
import { ImageExtensions } from "../../constants/constants.js";
import { authantication_middelware } from "../../middelware/authantication-middelware.js";
const usercontroller = Router();

usercontroller.patch('/upload-profile',authantication_middelware(),
multermiddelware("user/profile",ImageExtensions).single('image'),authservice.uploadimage);

usercontroller.patch('/upload-cover',authantication_middelware(),
multermiddelware("user/cover",ImageExtensions).array('image',5),authservice.uploadcover);

usercontroller.patch('/upload-image-cloud',authantication_middelware(),
multermiddelwarehost(ImageExtensions).single('image'),authservice.uploadimagecloud);   

usercontroller.patch('/upload-cover-cloud',authantication_middelware(),
multermiddelwarehost(ImageExtensions).array('image',5),authservice.uploadcovercloud);
 

usercontroller.delete('/delete-account',authantication_middelware(),authservice.DeleteAccount);


usercontroller.put('/update-profile',authantication_middelware(),authservice.updateprofile);


usercontroller.get('/get-profile',authantication_middelware(),authservice.getprofile);
usercontroller.get('/list-users',authservice.listusers);
usercontroller.post('/send-request/:requesttoid',authantication_middelware(),authservice.sendrequest);
usercontroller.patch('/accept-friend-request/:requestFromId',authantication_middelware(),authservice.AcceptFriendRequestService);
usercontroller.get('/list-friends',authantication_middelware(),authservice.listfriend);
export default usercontroller;
