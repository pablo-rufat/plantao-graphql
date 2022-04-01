import { GraphQLString } from "graphql";
import { userResolvers } from "../resolvers";
import { UserTypeDef } from "../typeDefs";

const createUser = {
    type: UserTypeDef,
    args: {
        email: { type: GraphQLString },
        username: { type: GraphQLString },
        password: { type: GraphQLString },
    },
    resolve: userResolvers.createUser,
};

export default createUser;