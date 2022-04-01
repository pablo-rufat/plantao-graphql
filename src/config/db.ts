import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../entities';

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
    entities: [ User ],
    synchronize: true,
})

AppDataSource.initialize()
.then(() => {
    console.log("Data Source has been initialized!")
})
.catch((err) => {
    console.error("Error during Data Source initialization", err)
})