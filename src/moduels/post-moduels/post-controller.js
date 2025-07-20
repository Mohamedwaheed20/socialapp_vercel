import { Router } from "express";
import *as postservice from './service/post-service.js';
import { authantication_middelware } from "../../middelware/authantication-middelware.js";
import { multermiddelware, multermiddelwarehost } from "../../middelware/multer-middelware.js";
import { ImageExtensions } from "../../constants/constants.js";
import { checkuser } from "../../middelware/check-user-middeleware.js";
import commentcontroller from "../comment-moduels/comment-controller.js";
const postcontroller = Router(
    {
        case_sensitive: true,
        strict:true

    }
);
// postcontroller.use("/create-comment/:id",commentcontroller)

postcontroller.post('/create-post',authantication_middelware(),
multermiddelwarehost(ImageExtensions).array('image',5),checkuser,postservice.addpostservice);

postcontroller.get('/list-posts',authantication_middelware(),postservice.listpost);

export default postcontroller;