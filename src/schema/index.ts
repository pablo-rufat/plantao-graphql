import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import * as queries from './queries'; 
import * as mutations from './mutations'; 

const rootQuery = new GraphQLObjectType({
    name: 'rootQuery',
    fields: queries,
});

const rootMutation = new GraphQLObjectType({
    name: 'rootMutation',
    fields: mutations,
})

export default new GraphQLSchema({
    query: rootQuery,
    mutation: rootMutation,
});