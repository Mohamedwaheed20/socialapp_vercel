import { GraphQLSchema,GraphQLObjectType } from "graphql";
import { postfields } from "./fields/post-fields.js";


export const mainSchema=new GraphQLSchema({
    query:new GraphQLObjectType({
        name:"mainQuery",
        description:"this is main query",
        fields:{
            ...postfields.query

            
        }
        
    }),
    mutation:new GraphQLObjectType({
        name:"mainMutation",
        description:"this is main mutation",
        fields:{
            ...postfields.mutation
        }
        
    })
    
    
})