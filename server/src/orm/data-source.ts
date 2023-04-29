import "reflect-metadata";
import {DataSource} from "typeorm";
import {Professor} from "./entity/professor/Professor";
import {Review} from "./entity/professor/Review";
import {Course} from "./entity/course/Course";
import {CourseFile} from "./entity/course/CourseFile";
import {ReviewRating} from "./entity/professor/ReviewRating";
import {FileRating} from "./entity/course/FileRating";
import {FileAccessToken} from "./entity/course/FileAccessToken";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: true,
    ssl: false,
    logging: false,
    entities: [Professor, Review, Course, CourseFile, ReviewRating, FileRating, FileAccessToken],
    migrations: [],
    subscribers: [],
})
