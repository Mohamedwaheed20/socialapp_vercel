import { GraphQLBoolean, GraphQLID, GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";
import { image_type } from "./commen-type.js";
import { usertype } from "./user-type.js";


export const posttype=new GraphQLObjectType({
    name:"Posttype",
    description:"this is post type",
    fields:{
        _id:{
            type:GraphQLID,
        },
        titel:{
            type:GraphQLString,
        },  description:{
            type:GraphQLString,
        },  images:{
            type:image_type("image_post_type"),
        },  owner_id:{
            type:usertype,
        },  tags:{
            type:new GraphQLList(GraphQLID),
        },  allowcomments:{
            type:GraphQLBoolean,
        }
        
    }
    
})