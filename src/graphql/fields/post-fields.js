import {  GraphQLBoolean, GraphQLList, GraphQLNonNull, GraphQLString } from "graphql";
import { createpost, listallpost } from "../resolver/post-resolver.js";
import { posttype } from "../type/post-type.js";



export const postfields={
    query:{
        listpost:{
            type:new GraphQLList(posttype),
            description:"this is list post",
            
            resolve:()=>listallpost()
            
        }
    },
    mutation:{
        createpost:{
            type:GraphQLString,
            description:"this is create post",
            args:{
                accesstoken:{type:new GraphQLNonNull(GraphQLString),description:"this is accesstohen"},
                titel:{type:GraphQLString,description:"this is titel"},
                description:{type:GraphQLString,description:"this is description"},
                allowcomments:{type:GraphQLBoolean,description:"this is allow comments"},
                
            },
            resolve:(_,args)=>createpost(args)
            
        }
    }

}