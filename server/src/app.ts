import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import courseRouter from "./routes/CourseRouter";
import professorRouter from "./routes/ProfessorRouter";
import authRouter from "./routes/AuthRouter";
import bodyParser from "body-parser";
import {AppDataSource} from "./orm/data-source";
import {loadAzure} from "./azure";
import {SitemapStream, streamToPromise} from "sitemap";
import {createGzip} from "zlib";
import {Professor} from "./orm/entity/professor/Professor";
import {Course} from "./orm/entity/course/Course";
import sharedRouter from "./routes/SharedRouter";


const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true, limit: "100mb"}));
app.use(bodyParser.json({limit: "100mb"}));

let sitemap: Buffer;

app.get("/sitemap.xml", async (req, res) => {
    res.header('Content-Type', 'application/xml');
    res.header('Content-Encoding', 'gzip');

    if (sitemap) {
        res.send(sitemap)
        return
    }

    try {
        const smStream = new SitemapStream({hostname: 'https://uaeu.space/'})
        const pipeline = smStream.pipe(createGzip())

        smStream.write({url: '/'})

        const professors = await AppDataSource.getRepository(Professor).find({
            select: {name: true, email: true},
            order: {views: "desc"}
        });

        for (let prof of professors) {
            smStream.write({url: '/professor/' + prof.email.replace("@", "%40"), changefreq: 'daily', priority: 0.5});
        }

        const courses = await AppDataSource.getRepository(Course).find({
            select: {name: true, tag: true}, order: {views: "desc"}
        });

        for (let course of courses) {
            smStream.write({url: '/course/' + course.tag, changefreq: 'daily', priority: 0.5})
        }

        streamToPromise(pipeline).then(sm => sitemap = sm)

        smStream.end()

        pipeline.pipe(res).on('error', (e) => {
            throw e
        })
    } catch (e) {
        console.error(e)
        res.status(500).end()
    }

});

app.use("/course", courseRouter);
app.use("/professor", professorRouter);
app.use("/auth", authRouter);
app.use("/rating", sharedRouter);

const port = process.env.PORT || 4000;

const main = (): void => {
    loadAzure().then(r => console.log("Azure client loaded."));

    AppDataSource.initialize().catch(error => console.log(error));

    app.listen(port, () => {
        console.log(`Socket is listening on port ${port}`);
    });
}

main();

export default app;