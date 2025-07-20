
import { User } from "../../../db/models/user_models.js";
import { compareSync, hashSync } from "bcrypt";
import { emitter } from "../../../service/send-email-service.js";
import { v4 as uuidv4 } from "uuid";
import { generateToken } from "../../../utils/tocken-utilits.js";
import { OAuth2Client } from "google-auth-library";
import { providerenum } from "../../../constants/constants.js";

export const signupservice = async (req, res, next) => {
    try {
        const { username, email, password, gender, phone, dob, priviteaccount } = req.body;

        const isemailexist = await User.findOne({ email });
        if (isemailexist) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const ispublic = priviteaccount ? false : true
        const otp = Math.floor(100000 + Math.random() * 900000);
        const hashedotp = hashSync(otp.toString(), 10);

        emitter.emit("sendemail", {
            email,
            subject: "welcome to social-app",
            html: `<h1>${otp}</h1> `

        });
        const user = await new User({
            username,
            email,
            password,
            gender,
            phone,
            ispublic,
            dob,
            confirmotp: hashedotp,
        })

        await user.save()
        res.status(201).json({ message: "user created" })


    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}

export const connfirmotp = async (req, res, next) => {

    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email, isverified: false, confirmotp: { $exists: true } });
        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }
        const matchedotp = compareSync(otp, user.confirmotp);
        if (!matchedotp) {
            return res.status(400).json({ message: "invalid otp" })
        }
        await User.findByIdAndUpdate(user._id, { isverified: true, $unset: { confirmotp: "" } })
        res.status(200).json({ message: "user verified" })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}
export const signinservice = async (req, res, next) => {

    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }
        const matchedpassword = compareSync(password, user.password);
        if (!matchedpassword) {
            return res.status(400).json({ message: "invalid password" })
        }
        const accesstoken = generateToken({
            publicclaims: user._id,
            registeredclaims: {
                expirein: process.env.accesstoken_expirein, jwtid: uuidv4()
            },
            secretkey: process.env.jwtsecretkey

        })
        const refreshtoken = generateToken({
            publicclaims: {
                _id: user._id
            },
            regesterdclaims: {
                expirein: process.env.refreshtoken_expirein, jwtid: uuidv4()
            },
            secretkey: process.env.secretkey_refreshtoken

        })
        res.status(200).json({ message: "user logged in", accesstoken, refreshtoken })


    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}

export const GmailloginService = async (req, res, next) => {
    try {
        const { idToken } = req.body;

        const client = new OAuth2Client();

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.WEB_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email_verified, email } = payload;
        if (!email_verified) {
            return res.status(400).json({ message: "invalid email" })
        }
        const user = await User.findOne({ email, provider: providerenum.googel });
        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }
        const accesstoken = generateToken({
            publicclaims: {
                _id: user._id
            },
            registeredclaims: {
                expirein: process.env.accesstoken_expirein, jwtid: uuidv4()
            },
            secretkey: process.env.jwtsecretkey

        })
        const refreshtoken = generateToken({
            publicclaims: {
                _id: user._id
            },
            regesterdclaims: {
                expirein: process.env.refreshtoken_expirein, jwtid: uuidv4()
            },
            secretkey: process.env.secretkey_refreshtoken

        })
        res.status(200).json({ message: "user logged in", accesstoken, refreshtoken })

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}
export const signupservicebygmail = async (req, res, next) => {
    try {
        const { idToken } = req.body;

        const client = new OAuth2Client();

        const ticket = await client.verifyIdToken({
            idToken,
            audience: process.env.WEB_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const { email_verified, email } = payload;
        if (!email_verified) {
            return res.status(400).json({ message: "invalid email" })
        }

        const isemailexist = await User.findOne({ email });
        if (isemailexist) {
            return res.status(400).json({ message: 'Email already exists' });
        }
        const user = new User({
            username: payload.name,
            email,
            provider: providerenum.googel,
            password: (uuidv4()),
            isverified: true
        })
        await user.save();
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}

export const forgotpasswordservice = async (req, res, next) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "user not found" })
        }
        const otp = Math.floor(100000 + Math.random() * 900000);
        const hashedotp = hashSync(otp.toString(), 10);
        await User.findByIdAndUpdate(user._id, { confirmotp: hashedotp })
        emitter.emit("sendemail", {
            email,
            subject: "welcome to social-app",
            html: `<h1>${otp}</h1> `

        });
        res.status(200).json({ message: "otp sent" })


    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}
export const resetpasswordservice = async (req, res, next) => {
    try {
        const { email,otp,password,confirmpassword} = req.body;
        const user = await User.findOne({ email });
        if (!user) {
     return res.status(400).json({ message: "user not found" })

        }
        const matchedotp = compareSync(otp, user.confirmotp);
        if (!matchedotp) {
            return res.status(400).json({ message: "invalid otp" })
        }
        if(password !== confirmpassword){
            return res.status(400).json({ message: "password not match" })
        }
        const hashedpassword = hashSync(password, 10);
        await User.findByIdAndUpdate({email:email}, { password: hashedpassword })
        await User.findByIdAndUpdate({email:email}, { $unset: { confirmotp: "" } })
        res.status(200).json({ message: "password reset" })
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
} 
export const refreshtokenService=async(req,res)=>{
    try {
        const {refreshtoken}=req.headers
        if (!refreshtoken) {
            throw new Error("Refresh token missing")
        }
        const decoded=jwt.verify(refreshtoken,process.env.secretkey_refreshtoken)
        const user=await  User.findById(decoded._id)
        if (!user) {
            throw new Error("User not found")
        }
        const accesstoken=jwt.sign({_id: decoded._id, email: decoded.email },process.env.jwtsecretkey,{expiresIn:"2h"})
        res.status(200).json({message:"refresh token generated successfully",accesstoken:accesstoken})
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Something went wrong', error });
    }
}

