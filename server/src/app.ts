import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import courseRouter from "./routes/CourseRouter";
import professorRouter from "./routes/ProfessorRouter";
import bodyParser from "body-parser";
import {AppDataSource} from "./orm/data-source";
import {loadAzure} from "./azure";


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
        /*
                console.log("Inserting a new user into the database...")
                const professor = await AppDataSource.manager.getRepository(Course).findOne({where: {tag: "MATH110"}})
                const file = new CourseFile();
                file.created_at = new Date();
                file.reference = "sofmpqvjvirodfdsfdse";
                file.course = professor!;
                file.name = "practice-test-study-01.pdf"
                file.size = 10000000;
                file.type = FileType.PDF;

                await AppDataSource.getRepository(CourseFile).save(file);*/

    }).catch(error => console.log(error))

    app.listen(port, () => {
        console.log(`Socket is listening on port ${port}`);
    });
}

main();

export default app;