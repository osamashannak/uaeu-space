import "reflect-metadata";
import {Rating, FileRating, ReviewRating} from "./entity/Rating";
import {DataSource} from "typeorm";
import {Professor} from "./entity/professor/Professor";
import {Review} from "./entity/professor/Review";
import {Course} from "./entity/course/Course";
import {CourseFile} from "./entity/course/CourseFile";
import {FileAccessToken} from "./entity/course/FileAccessToken";
import {ReviewFlag} from "./entity/professor/ReviewFlag";
import Client from "./entity/Client";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: true,
    ssl: false,
    logging: true,
    entities: [Professor, Review, Client, CourseFile, Course, Rating, FileRating, ReviewRating, ReviewFlag, FileAccessToken],
    migrations: [],
    subscribers: [],
})
