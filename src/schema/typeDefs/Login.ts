import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

const LoginTypeDef = new GraphQLObjectType({
    name: 'Login',
    fields: {
        userId: { type: GraphQLID},
        token: { type: GraphQLString }
    }
});

export default LoginTypeDef;