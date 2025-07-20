import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

export const genderenum=new GraphQLObjectType({
    name:"genderenum",
    description:"this is gender enum",
    values:{
        male:{
           value:"MALE"
        },
        female:{
            value:"FEMALE"
        },
        other:{
            value:"OTHER"
        }
    }
})

export const usertype=new GraphQLObjectType({
    name:"usertype",
    description:"this is user type",
    fields:{
        _id:{
            type:GraphQLID, 
        },
        username:{    
            type:GraphQLString,
        },
       
        phone:{
            type:GraphQLString,
        }
      
       
        
    }
    
})