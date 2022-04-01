import { GraphQLString } from "graphql";
import verifyToken from '../../middlewares/auth';

const needAuth = {
    type: GraphQLString,
    resolve: async (parent: any, args: any, context: any) => {
        const { req } = context;
        const userId = verifyToken(req)

        console.log(userId);

        return 'Auth OK.'
    },
};

export default needAuth;