import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import courseRouter from "./routes/CourseRouter";
import professorRouter from "./routes/ProfessorRouter";
import dashboardRouter from "./routes/DashboardRouter";
import bodyParser from "body-parser";
import {AppDataSource} from "./orm/data-source";
import {loadAzure} from "./azure";
import {SitemapStream, streamToPromise} from "sitemap";
import {createGzip} from "zlib";
import {Professor} from "./orm/entity/Professor";
import {Course} from "./orm/entity/Course";
import {AdClick} from "./orm/entity/AdClick";
import requestIp from "request-ip";
import jwt from "jsonwebtoken";

export let JWT_SECRET: jwt.Secret;

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true, limit: "100mb"}));
app.use(bodyParser.json({limit: "100mb"}));


app.get("/advertisement", async (req, res) => {
    res.redirect("https://www.88studies.com/");

    let address = requestIp.getClientIp(req);

    if (!address) {
        return;
    }

    if (address.includes(":")) {
        address = address.split(":").slice(-1).pop()!;
    }

    const adClickRepo = AppDataSource.getRepository(AdClick);

    const adClick = await adClickRepo.findOne({where: {ipAddress: address}});

    if (!adClick) {
        const newAdClick = new AdClick();
        newAdClick.ipAddress = address;
        await adClickRepo.save(newAdClick);
        return;
    }

    adClick.lastVisit = new Date();
    adClick.visits += 1;

    await adClickRepo.save(adClick);
});

app.get("/sitemap.xml", async (req, res) => {
    res.header('Content-Type', 'application/xml');
    res.header('Content-Encoding', 'gzip');

    let sitemap: Buffer;

    try {
        const smStream = new SitemapStream({hostname: 'https://uaeu.space/'})
        const pipeline = smStream.pipe(createGzip())

        smStream.write({url: '/'})

        const professors = await AppDataSource.getRepository(Professor).find({
            select: {name: true, email: true},
            relations: ["reviews"],
            order: {views: "desc"}
        });

        for (let prof of professors) {
            if (prof.reviews.length > 0) {
                smStream.write({
                    url: '/professor/' + prof.email.replace("@", "%40"),
                    changefreq: 'daily',
                    priority: 0.5
                });
            }
        }

        const courses = await AppDataSource.getRepository(Course).find({
            select: {name: true, tag: true},
            relations: ["files"],
            order: {views: "desc"}
        });

        for (let course of courses) {
            course.files = course.files.filter(value => value.visible);
            if (course.files.length > 0) {
                smStream.write({
                    url: '/course/' + course.tag,
                    changefreq: 'daily',
                    priority: 0.5
                });
            }
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
app.use("/dashboard", dashboardRouter);

const port = process.env.PORT || 4000;

const main = (): void => {

    JWT_SECRET = require('crypto').randomBytes(32).toString('hex');

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