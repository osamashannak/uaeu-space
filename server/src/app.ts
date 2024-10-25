import dotenv from "dotenv";

dotenv.config();

import express from "express";
import courseRouter from "./routes/CourseRouter";
import professorRouter from "./routes/ProfessorRouter";
import dashboardRouter from "./routes/DashboardRouter";
import bodyParser from "body-parser";
import {AzureClient} from "./azure";
import {SitemapStream, streamToPromise} from "sitemap";
import {createGzip} from "zlib";
import {Professor} from "@spaceread/database/entity/professor/Professor";
import {Course} from "@spaceread/database/entity/course/Course";
import {AdClick} from "@spaceread/database/entity/AdClick";
import requestIp from "request-ip";
import jwt from "jsonwebtoken";
import VirusTotalClient from "./virustotal";
import {createDataSource} from "@spaceread/database";
import cookies from "cookie-parser";
import cors from "cors";

export let JWT_SECRET: jwt.Secret;
export let VTClient: VirusTotalClient;
export let Azure: AzureClient;
export const AppDataSource = createDataSource({
    host: process.env.POSTGRES_HOST,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
});

const app = express();

app.use(cookies());
app.use(bodyParser.urlencoded({extended: true, limit: "100mb"}));
app.use(bodyParser.json({limit: "100mb"}));

app.get("/advertisement", async (req, res) => {
    res.redirect("https://wa.me/qr/37BIBC2LRMFRB1");

    let address = requestIp.getClientIp(req);

    if (!address) {
        return;
    }

    if (address.includes(":")) {
        address = address.split(":").slice(-1).pop()!;
    }

    const adClickRepo = AppDataSource.getRepository(AdClick);

    const adClick = await adClickRepo.findOne({where: {ip_address: address}});

    if (!adClick) {
        const newAdClick = new AdClick();
        newAdClick.ip_address = address;
        await adClickRepo.save(newAdClick);
        return;
    }

    adClick.last_visit = new Date();
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

app.use("/course", cors(), courseRouter);
app.use("/professor", professorRouter);
app.use("/dashboard", cors(), dashboardRouter);

(async function main() {
    const port = process.env.PORT;

    if (!port) {
        throw Error("Missing PORT environment variable.");
    }

    if (!process.env.JWT_SECRET) {
        throw Error("Missing JWT_SECRET environment variable.");
    }

    JWT_SECRET = process.env.JWT_SECRET;

    VTClient = new VirusTotalClient();

    Azure = new AzureClient();
    console.log("Azure client loaded.")

    await AppDataSource.initialize();
    console.log("Connected to database.")

    app.listen(port, () => {
        console.log(`Socket is listening on port ${port}`);
    });
})()