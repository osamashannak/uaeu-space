import "reflect-metadata";
import {DataSource} from "typeorm";
import {Professor} from "./entity/Professor";
import {Review} from "./entity/Review";
import {Course} from "./entity/Course";
import {CourseFile} from "./entity/CourseFile";
import {ReviewRatings} from "./entity/ReviewRatings";
import {FileRating} from "./entity/FileRating";
import {FileAccessToken} from "./entity/FileAccessToken";
import {AdClick} from "./entity/AdClick";

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    synchronize: false,
    ssl: true,
    logging: false,
    entities: [Professor, Review, Course, CourseFile, ReviewRatings, FileRating, FileAccessToken, AdClick],
    migrations: [],
    subscribers: [],
})
