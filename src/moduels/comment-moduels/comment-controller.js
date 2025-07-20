import { Router } from "express";
import *as commentservice from './service/comment-service.js';
import { authantication_middelware } from "../../middelware/authantication-middelware.js";
import { multermiddelware, multermiddelwarehost } from "../../middelware/multer-middelware.js";
import { ImageExtensions } from "../../constants/constants.js";
import { checkuser } from "../../middelware/check-user-middeleware.js";
const commentcontroller = Router();

commentcontroller.post('/create-comment/:commentonid',authantication_middelware(),
multermiddelwarehost(ImageExtensions).array('image',5),checkuser,commentservice.addcommentservice);


commentcontroller.get('/list-comments/:id',authantication_middelware(),commentservice.listcommentservice);


export default commentcontroller;