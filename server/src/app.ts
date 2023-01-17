import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import courseRouter from "./routes/courseRouter";
import professorRouter from "./routes/professorRouter";
import setMongo from "./mongo";
import bodyParser from "body-parser";

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

app.use("/api/course", courseRouter);
app.use("/api/professor", professorRouter);

const port = process.env.PORT || 3000;

const main = (): void => {
    setMongo().then(r => console.log('Connected to MongoDB'));
    app.listen(port, () => {
        console.log(`Socket is listening on port ${port}`);
    });
}

main();

export default app;