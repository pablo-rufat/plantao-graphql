import { GraphQLString } from "graphql";
import { userResolvers } from "../resolvers";
import { LoginTypeDef } from "../typeDefs";

const login = {
    type: LoginTypeDef,
    args: {
        email: { type: GraphQLString },
        password: { type: GraphQLString },
    },
    resolve: userResolvers.login,
};

export default login;