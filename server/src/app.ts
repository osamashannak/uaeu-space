import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import courseRouter from "./routes/CourseRouter";
import professorRouter from "./routes/ProfessorRouter";
import bodyParser from "body-parser";
import {AppDataSource} from "./orm/data-source";
import {loadAzure} from "./azure";
import {CourseFile} from "./orm/entity/CourseFile";


const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true, limit: "100mb"}));
app.use(bodyParser.json({limit: "100mb"}));

app.use("/course", courseRouter);
app.use("/professor", professorRouter);

const port = process.env.PORT || 4000;

const main = (): void => {

    loadAzure().then(r => console.log("Azure client loaded."));

    AppDataSource.initialize().then(async () => {

        /*console.log("Inserting a new user into the database...")
        const files = await AppDataSource.manager.getRepository(CourseFile).find({relations: ['course']});
        console.log(files)*/

    }).catch(error => console.log(error))

    app.listen(port, () => {
        console.log(`Socket is listening on port ${port}`);
    });
}

main();

export default app;