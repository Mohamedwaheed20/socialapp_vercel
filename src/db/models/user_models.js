import mongoose from "mongoose";
import { system_constants, providerenum } from "../../constants/constants.js";
import { hashSync } from "bcrypt";
import { decruption, encription } from "../../utils/encryption.js";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    phone: {
        type: String,
        required: true
    },
    dob: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    role: {
        type: String,
        default: system_constants.admin,
        enum: [system_constants.admin, system_constants.user

        ]
    },
    isDeactivated: {
        type: Boolean,
        default: false
    },
    profilePicture: {
       secure_url: String,
       public_id: String,
       folder:String

    },
    coverPicture: {
        image:[
            {
           
        secure_url: String,
        public_id: String,
            }
     ],
     folder:String
     },
    provider: {
        type: String,
        default: providerenum.system,
        enum: [providerenum.googel, providerenum.facebook, providerenum.system]

    },
    confirmotp: {
        type: String,
    },
    forgetotp: {
        type: String,

    },
    ispublic: {
        type: Boolean,
        default: true
    },
    isverified: {
        type: Boolean,
        default: false
    },
    allowedcomments: {
        type: Boolean,
        default: true
    }
}, {
}, {
    timestamps: true
})



userSchema.pre("save",function () {
    // console.log("pre save",this);
    const changes=this.getChanges()[`$set`];
    if(changes.password){
    this.password=hashSync(this.password, +process.env.salt);
    }
    if(changes.phone){
    this.phone=encription({value:this.phone,secretkey:process.env.encruption_secretkey})
    }
    // console.log("post] save",this);

})

//لو عاوز حجه كويري تبقي دوكيمنت

userSchema.pre("updateOne",{document:true,query:false},function () {
    console.log("pre update document",this);
})

userSchema.post("[findOne,find]",function (doc) {
    //  console.log("post find one",this);
if(this.op=="find"){
    doc.forEach(doc => {
        doc.phone=decruption({cipher:doc.phone,secretkey:process.env.encruption_secretkey})
        
    });
}
else {
    this.phone=decruption({cipher:this.phone,secretkey:process.env.encruption_secretkey})
}
})
export const User = mongoose.models.User || mongoose.model("User", userSchema)

