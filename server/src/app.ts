import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import courseRouter from "./routes/courseRouter";
import professorRouter from "./routes/professorRouter";
import bodyParser from "body-parser";
import {AppDataSource} from "./orm/data-source";
import {Professor} from "./orm/entity/Professor";
import {Review} from "./orm/entity/Review";

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use("/api/course", courseRouter);
app.use("/api/professor", professorRouter);

const port = process.env.PORT || 4000;

const main = (): void => {

    AppDataSource.initialize().then(async () => {

        /*console.log("Inserting a new user into the database...")
        const professor = await AppDataSource.manager.getRepository(ProfessorBlock).findOne({where: {email: "osama@gmail.com"}})
        const review = new Review();
        review.author = "Anonymous";
        review.comment = "I dont recommend studying with him.";
        review.difficulty = 3;
        review.quality = 1;
        review.professor = professor!;
        await AppDataSource.getRepository(Review).save(review);*/

    }).catch(error => console.log(error))

    app.listen(port, () => {
        console.log(`Socket is listening on port ${port}`);
    });
}

main();

export default app;