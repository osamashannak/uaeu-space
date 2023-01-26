import "reflect-metadata";
import { DataSource } from "typeorm";
import {Professor} from "./entity/Professor";
import {Review} from "./entity/Review";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.PG_HOST,
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: true,
    logging: false,
    entities: [Professor, Review],
    migrations: [],
    subscribers: [],
})
