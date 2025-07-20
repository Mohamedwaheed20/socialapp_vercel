import mongoose from "mongoose";
import { reacts } from "../../constants/constants.js";

const reactschema = new mongoose.Schema({
    reactionid: {
        type: mongoose.Schema.Types.ObjectId,
        refpath: "onmodel",
        required: true
    }, onmodel: {
        type: String,
        enum: ["Post", "Comment"],
        required: true
    },
    owner_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    reactiontype: {
        type: String,
        enum: Object.values(reacts),
    }
}, { timestamps: true });

const React = mongoose.models.React || mongoose.model("React", reactschema);
export default React

