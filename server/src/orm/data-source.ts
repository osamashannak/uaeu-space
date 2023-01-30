import "reflect-metadata";
import {DataSource} from "typeorm";
import {Professor} from "./entity/Professor";
import {Review} from "./entity/Review";
import {Course} from "./entity/Course";
import {File} from "./entity/File";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.PG_HOST,
    port: 5432,
    username: "postgres",
    password: "123",
    database: "test",
    synchronize: true,
    logging: false,
    entities: [Professor, Review, Course, File],
    migrations: [],
    subscribers: [],
})
