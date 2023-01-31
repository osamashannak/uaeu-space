import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import courseRouter from "./routes/courseRouter";
import professorRouter from "./routes/professorRouter";
import bodyParser from "body-parser";
import {AppDataSource} from "./orm/data-source";
import {File, FileType} from "./orm/entity/File";
import {Course} from "./orm/entity/Course";

dotenv.config();

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use("/api/course", courseRouter);
app.use("/api/professor", professorRouter);

const port = process.env.PORT || 4000;

const main = (): void => {

    AppDataSource.initialize().then(async () => {

        /*console.log("Inserting a new user into the database...")
        const professor = await AppDataSource.manager.getRepository(Course).findOne({where: {tag: "MATH110"}})
        const file = new File();
        file.created_at = new Date();
        file.reference = "sofmpqvjviroe";
        file.course = professor!;
        file.name = "practice-test-study-01.pdf"
        file.size = 10000000;
        file.type = FileType.PDF;

        await AppDataSource.getRepository(File).save(file);*/

    }).catch(error => console.log(error))

    app.listen(port, () => {
        console.log(`Socket is listening on port ${port}`);
    });
}

main();

export default app;