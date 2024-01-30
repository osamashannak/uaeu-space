import "reflect-metadata";
import {DataSource} from "typeorm";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: false,
    ssl: false,
    logging: true,
    entities: [__dirname + "\\entity\\**\\*{.ts,.js}"],
    migrations: [],
    subscribers: [],
})
