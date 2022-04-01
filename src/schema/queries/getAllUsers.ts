import { GraphQLList } from "graphql";
import { userResolvers } from "../resolvers";
import { UserTypeDef } from "../typeDefs";

const getAllUsers = {
    type: new GraphQLList(UserTypeDef),
    resolve: userResolvers.getAllUsers,
};

export default getAllUsers;