import { Router } from 'express';
// import {  validationmidellware } from '../../middelware/validation.midellware.js';
// import { signupschema } from '../validator/auth.schema.js';
import *as authservice from './service/authanticatin_servie.js';
const authcontroller = Router();

authcontroller.post('/signup', authservice.signupservice);
authcontroller.put('/connfirm-otp', authservice.connfirmotp);
authcontroller.post('/signin', authservice.signinservice);
authcontroller.post('/gmail-login', authservice.GmailloginService);
authcontroller.post('/gmail-signup', authservice.signupservicebygmail);
 authcontroller.patch('/forgot-password', authservice.forgotpasswordservice);
 authcontroller.put('/reset-password', authservice.resetpasswordservice);
 authcontroller.post('/refresh-token', authservice.refreshtokenService);
export default authcontroller;

