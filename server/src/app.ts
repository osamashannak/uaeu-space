import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import courseRouter from "./routes/CourseRouter";
import professorRouter from "./routes/ProfessorRouter";
import bodyParser from "body-parser";
import {AppDataSource} from "./orm/data-source";
import {loadAzure} from "./azure";
import {SitemapStream, streamToPromise} from "sitemap";
import {createGzip} from "zlib";
import {Course} from "./orm/entity/Course";
import {AdClick} from "./orm/entity/AdClick";
import requestIp from "request-ip";
import sharedRouter from "./routes/SharedRouter";
import {Professor} from "./orm/entity/professor/Professor";
import VirusTotalClient from "./virustotal";

export let VTClient: VirusTotalClient;
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
app.use("/shared", sharedRouter);

app.use(function (req, res, next) {
    if (req.secure) {
        res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        res.setHeader('Cache-Control', 'private, no-cache, s-maxage=0, max-age=0, must-revalidate, no-store');
        res.setHeader('X-XSS-Protection', '0');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('X-Frame-Options', 'SAMEORIGIN');
        res.removeHeader("X-Powered-By");
    }
    next();
})

const port = process.env.PORT || 4000;

(async function main() {

    VTClient = new VirusTotalClient();

    await loadAzure();
    console.log("Azure client loaded.")

    await AppDataSource.initialize();
    console.log("Connected to database.")

    app.listen(port, () => {
        console.log(`Socket is listening on port ${port}`);
    });
})()