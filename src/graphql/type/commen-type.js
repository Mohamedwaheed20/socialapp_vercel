import { GraphQLList, GraphQLObjectType, GraphQLString } from "graphql";

export  const urlsimagetype=(name)=> {
    return new GraphQLObjectType({
    name:name||"urlsimagetype",
    description:"this is urls image type",
    fields:{
        secure_url:{
            type:GraphQLString,
        },
        public_id:{
            type:GraphQLString,
        }
       
        
    }
})
}

export const image_type=(name)=>{
    return new GraphQLObjectType({
        name:name||"Image",
        description:"this is image type",
        fields:{
            urls:{
                type:new GraphQLList(urlsimagetype("urlsimagetype")),
            },
        folder:{
            type:GraphQLString,
        }
        
    }
})
}