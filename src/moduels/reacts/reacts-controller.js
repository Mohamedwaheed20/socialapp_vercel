import { Router } from "express";
import *as reactservice from './service/react-service.js';
import { authantication_middelware } from "../../middelware/authantication-middelware.js";
import { multermiddelware, multermiddelwarehost } from "../../middelware/multer-middelware.js";
import { ImageExtensions } from "../../constants/constants.js";
import { checkuser } from "../../middelware/check-user-middeleware.js";
const reactscontroller = Router();


reactscontroller.post('/add-react/:reactionid',authantication_middelware(),
reactservice.addreact);

reactscontroller.delete('/delete-react/:reactionid',authantication_middelware(),
reactservice.deletereact);

export default reactscontroller;