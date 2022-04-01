import { GraphQLString } from "graphql";

const greetings = {
    type: GraphQLString,
    resolve: () => 'Hello world',
};

export default greetings;