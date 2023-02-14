"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const Professor_1 = require("./entity/Professor");
const Review_1 = require("./entity/Review");
const Course_1 = require("./entity/Course");
const CourseFile_1 = require("./entity/CourseFile");
const ReviewRatings_1 = require("./entity/ReviewRatings");
const FileRating_1 = require("./entity/FileRating");
const FileAccessToken_1 = require("./entity/FileAccessToken");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "postgres",
    host: process.env.POSTGRES_HOST,
    port: 5432,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl: true,
    synchronize: true,
    logging: false,
    entities: [Professor_1.Professor, Review_1.Review, Course_1.Course, CourseFile_1.CourseFile, ReviewRatings_1.ReviewRatings, FileRating_1.FileRating, FileAccessToken_1.FileAccessToken],
    migrations: [],
    subscribers: [],
});
