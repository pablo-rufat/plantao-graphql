import express, { Express, Request, Response } from 'express';
import { graphqlHTTP } from 'express-graphql';
import schema from './schema';

const app: Express = express();

app.use('/graphql', (req: Request, res: Response) => {
    graphqlHTTP({
        graphiql: true,
        schema,
        context: { req }
    })(req, res)
});

export default app;