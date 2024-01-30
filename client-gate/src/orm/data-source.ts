import "reflect-metadata";
import {DataSource} from "typeorm";
import {User} from "./entity/User";
import {Session} from "./entity/Session";


export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: false,
    ssl: process.env.POSTGRES_HOST !== "localhost",
    logging: process.env.ENVIRONMENT === "development",
    entities: [__dirname + "\\entity\\*{.ts,.js}"],
    migrations: [],
    subscribers: [],
})
