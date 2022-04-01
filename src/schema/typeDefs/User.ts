import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

const UserTypeDef = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLID},
        email: { type: GraphQLString},
        username: { type: GraphQLString},
    }
});

export default UserTypeDef;