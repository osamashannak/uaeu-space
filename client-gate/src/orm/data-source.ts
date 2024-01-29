import "reflect-metadata";
import {DataSource} from "typeorm";
import {User} from "./entity/User";
import {Session} from "./entity/Session";

console.log([__dirname + "\\entity\\*{.ts,.js}"])

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: true,
    ssl: true,
    logging: true,
    entities: [__dirname + "\\entity\\*{.ts,.js}"],
    migrations: [],
    subscribers: [],
})
