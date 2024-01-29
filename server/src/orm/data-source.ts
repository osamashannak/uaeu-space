import "reflect-metadata";
import {DataSource} from "typeorm";
import {Course} from "./entity/Course";
import {CourseFile} from "./entity/CourseFile";
import {FileAccessToken} from "./entity/FileAccessToken";
import {AdClick} from "./entity/AdClick";
import {ReviewAttachment} from "./entity/ReviewAttachment";
import {Review} from "./entity/professor/Review";
import {Professor} from "./entity/professor/Professor";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: true,
    ssl: true,
    logging: false,
    entities: [ReviewAttachment, Professor, Review, Course, CourseFile, FileAccessToken, AdClick],
    migrations: [],
    subscribers: [],
})
