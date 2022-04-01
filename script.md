- `mkdir plantao-graphql`
- `cd plantao-graphql`
- `npm init -y`
- `npm i express express-graphql graphql mysql2 typeorm dotenv cors bcryptjs`
- `npm i -D typescript ts-node-dev @types/bcryptjs @types/express @types/cors @types/node`
- `npx tsc --init`

```
{
  "compilerOptions": {
    "target": "es2016",
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true,
    "outDir": "./dist",
    "rootDir": "./src"
  }
}

```

- `mkdir src`
- `touch ./src/server.ts`

```
// ./src/server.ts

console.log('Hello world');
```

- `npx tsc`

```
// ./package.json

...

"scripts": {
    "dev": "ts-node-dev src/server.ts",
    "build": "tsc -p .",
    "start": "node dist/server.js"
},

...
```

- `touch ./src/app.ts`

```
// ./src/app.ts

import express, { Express } from 'express';

const app: Express = express();

export default app;
```

```
// ./src/server.ts

import app from "./app";
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
```

- `touch .env`

```
// .env

PORT=4000
```

```
// ./src/app.ts

import express, { Express } from 'express';
import { graphqlHTTP } from 'express-graphql';

const app: Express = express();

app.use('/graphql', graphqlHTTP({
    graphiql: true
}));

export default app;
```

- `mkdir ./src/schema`
- `touch ./src/schema/index.ts`

```
// ./src/schema/index.ts

import { GraphQLSchema, GraphQLObjectType } from 'graphql';

const rootQuery = new GraphQLObjectType({
    name: 'root',
    fields: {
        greetings: 
    }
});

new GraphQLSchema({
    query: {},
    mutation: {},
});
```
- `mkdir ./src/schema/queries`
- `touch ./src/schema/queries/index.ts`
- `touch ./src/schema/queries/greetings.ts`

```
// ./src/schema/queries/greetings.ts

import { GraphQLString } from "graphql";

const greetings = {
    type: GraphQLString,
    resolve: () => 'Hello world',
};

export default greetings;
```

```
// ./src/schema/queries/index.ts

import greetings from "./greetings";

export {
    greetings,
};
```

```
// ./src/schema/index.ts

import { GraphQLSchema, GraphQLObjectType } from 'graphql';
import { greetings } from './queries'; 

const rootQuery = new GraphQLObjectType({
    name: 'root',
    fields: {
        greetings
    }
});

export default new GraphQLSchema({
    query: rootQuery,
});
```

```
// ./src/app.ts

import express, { Express } from 'express';
import { graphqlHTTP } from 'express-graphql';
import schema from './schema';

const app: Express = express();

app.use('/graphql', graphqlHTTP({
    graphiql: true,
    schema
}));

export default app;
```

- `npm install reflect-metadata --save`

```
// ./src/server.ts

import "reflect-metadata"
```

- Para que typescript entenda os decoradores:
```
// ./tsconfig.json

"emitDecoratorMetadata": true,
"experimentalDecorators": true,
```

- `mkdir ./src/config`
- `touch ./src/config/db.ts`

```
// ./src/config/db.ts

import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
// import { User } from '../entities';

dotenv.config();

const {
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_USER,
    MYSQL_PASSWORD,
    MYSQL_DB,
} = process.env;

const AppDataSource = new DataSource({
    type: 'mysql',
    host: MYSQL_HOST,
    port: Number(MYSQL_PORT || '3306'),
    username: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DB,
    // entities: [ User ],
    synchronize: true,
})

AppDataSource.initialize()
.then(() => {
    console.log("Data Source has been initialized!")
})
.catch((err) => {
    console.error("Error during Data Source initialization", err)
})
```

```
// ./src/server.ts

import './config/db';
```

```
// .env

PORT=4000
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=password
MYSQL_DB=graphql
```

- Criar banco de dados `graphql` desde o DBeaver
- `mkdir ./src/entities`
- `touch ./src/entities/index.ts`
- `touch ./src/entities/User.ts`

```
// ./src/entities/User.ts

import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class User extends BaseEntity {
    
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    email: string;

    @Column()
    username: string;

    @Column()
    password: string;
}
```

```
// tsconfig.ts

"strictPropertyInitialization": false,
```

```
// ./src/entities/index.ts

import User from "./User";

export {
    User,
};
```

- Descomentar a importação da entidade no `AppDataSource`
- `mkdir ./src/schema/mutations`
- `touch ./src/schema/mutations/index.ts`
- `touch ./src/schema/mutations/createUser.ts`

```
// ./src/schema/mutations/createUser.ts

import { GraphQLString } from "graphql";

const createUser = {
    type: GraphQLString,
    resolve: () => 'User created',
};

export default createUser;
```

```
// ./src/schema/mutations/index.ts

import createUser from "./createUser";

export {
    createUser,
};
```

```
// ./src/schema/index.ts

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
```

```
// ./src/schema/mutations/createUser.ts

import { GraphQLString } from "graphql";

const createUser = {
    type: GraphQLString,
    args: {
        email: { type: GraphQLString },
        username: { type: GraphQLString },
        password: { type: GraphQLString },
    },
    resolve: (parent: any, args: any) => {
        console.log(parent);
        console.log(args);
    },
};

export default createUser;
```

- `mkdir ./src/schema/resolvers`
- `touch ./src/schema/resolvers/index.ts`
- `touch ./src/schema/resolvers/User.ts`

```
// ./src/schema/resolvers/User.ts

const createUser = async (parent: any, args: any) => {
    console.log(parent);
    console.log(args);
}

export {
    createUser,
};
```

```
// ./src/schema/resolvers/index.ts

import * as userResolvers from "./User";

export {
    userResolvers,
};
```

```
// ./src/schema/mutations/createUser.ts

import { GraphQLString } from "graphql";
import { userResolvers } from "../resolvers";

const createUser = {
    type: GraphQLString,
    args: {
        email: { type: GraphQLString },
        username: { type: GraphQLString },
        password: { type: GraphQLString },
    },
    resolve: userResolvers.createUser,
};

export default createUser;
```

```
// ./src/schema/resolvers/User.ts

import { User } from "../../entities";

const createUser = async (parent: any, args: any) => {
    const { email, username, password } = args;

    const result = await User.insert({ email, username, password });

    console.log(result);

    return 'Usuario inserido.'
}

export {
    createUser,
};
```

- `mkdir ./src/schema/typeDefs`
- `touch ./src/schema/typeDefs/index.ts`
- `touch ./src/schema/typeDefs/User.ts`

```
// ./src/schema/typeDefs/User.ts

import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

const UserTypeDef = new GraphQLObjectType({
    name: 'User',
    fields: {
        id: { type: GraphQLID},
        email: { type: GraphQLString},
        username: { type: GraphQLString},
        password: { type: GraphQLString},
    }
});

export default UserTypeDef;
```

```
// ./src/schema/typeDefs/index.ts

import UserTypeDef from "./User";

export {
    UserTypeDef,
};
```

```
// ./src/schema/mutations/createUser.ts

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
```

```
// ./src/schema/resolvers/User.ts

import { User } from "../../entities";

const createUser = async (parent: any, args: any) => {
    const { email, username, password } = args;

    const result = await User.insert({ email, username, password });

    console.log(result);

    return {
        id: result.identifiers[0].id,
        ...args
    }
}

export {
    createUser,
};
```

- Ahora vem a maior sacada do graphql (testar no playground escolhendo campos)


```
// ./src/schema/resolvers/User.ts

import { User } from "../../entities";
import bcrypt from 'bcryptjs';

const createUser = async (parent: any, args: any) => {
    const { email, username, password } = args;

    const hashPass = await bcrypt.hash(password, 10);

    const result = await User.insert({
        email,
        username,
        password: hashPass
    });

    console.log(result);

    return {
        id: result.identifiers[0].id,
        email,
        username,
    }
}

export {
    createUser,
};
```

- remover passwrod do typedef
- adicionar `{ unique: true}` a username e email.

### getAllUsers

- `touch ./src/schema/queries/getAllUsers.ts`

```
// ./src/schema/queries/getAllUsers.ts

import { userResolvers } from "../resolvers";
import { UserTypeDef } from "../typeDefs";
import { GraphQLList } from "graphql";

const getAllUsers = {
    type: new GraphQLList(UserTypeDef),
    resolve: userResolvers.getAllUsers,
};

export default getAllUsers;
```

```
// ./src/schema/queries/index.ts

import greetings from "./greetings";
import getAllUsers from "./getAllUsers";

export {
    greetings,
    getAllUsers,
};
```

```
// ./src/schema/resolvers/User.ts

...

const getAllUsers = async (parent: any, args: any) => {
    return User.find();
};

...
```

### login

- `npm i jsonwebtoken`
- `npm i --save-dev @types/jsonwebtoken`
- `touch ./src/schema/queries/login.ts`
- `touch ./src/schema/typeDefs/Login.ts`

```
// ./src/schema/queries/login.ts

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
```

```
// ./src/schema/typeDefs/Login.ts

import { GraphQLID, GraphQLObjectType, GraphQLString } from "graphql";

const LoginTypeDef = new GraphQLObjectType({
    name: 'Login',
    fields: {
        userId: { type: GraphQLID},
        token: { type: GraphQLString }
    }
});

export default LoginTypeDef;
```

- adicionar typedef ao index
- adicionar login quuery ao index

```
// ./src/schema/resolvers/User.ts

import jwt from 'jsonwebtoken';

const login = async (parent: any, args: any) => {
    const { email, password } = args;

    const result = await User.findOne({ where: { email } });

    if (result) {

        const matchPass = await bcrypt.compare(password, result.password);

        if (!matchPass) {
            throw new Error('Invalid password');
        }

        const token = jwt.sign({ userId: result.id }, 'SECRET!');

        return {
            userId: result.id,
            token,
        }
    }

    throw new Error('User not found');

};
```


### Auth middleware

- `mkdir ./src/middlewares`
- `touch ./src/middlewares/auth.ts`
- `touch ./src/schema/queries/needAuth.ts`


```
// ./src/app.ts

import express, { Express, Request } from 'express';
import { graphqlHTTP } from 'express-graphql';
import schema from './schema';

const app: Express = express();

app.use('/graphql', (req: Request) => graphqlHTTP({
    graphiql: true,
    schema,
    context: { req }
}));

export default app;
```

```
// ./src/schema/queries/needAuth.ts

import { GraphQLString } from "graphql";
import verifyToken from '../../middlewares/auth';

const needAuth = {
    type: GraphQLString,
    resolve: async (parent: any, args: any, context: any) => {
        const { req } = context;
        await verifyToken(req)
        return 'Auth OK.'
    },
};

export default needAuth;
```

- adicionar `needAuth` ao index

```
// ./src/middlewares/auth.ts

import { Request } from "express";
import jwt from 'jsonwebtoken';

interface AuthToken {
    userId: number;
}

export default (req: Request) => {
    const { authorization } = req.headers;

    if (!authorization) {
        throw new Error('Token not found.');
    }

    const token = authorization.replace('Bearer', '').trim();

    try {
        const data = jwt.verify(token, 'SECRET!');
        const { userId } = data as AuthToken;
        return userId;
    } catch (e) {
        throw new Error('Invalid token.');
    }
};
```