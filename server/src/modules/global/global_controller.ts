import {Request, Response} from "express";
import {AppDataSource} from "../../app";
import {SitemapStream, streamToPromise} from "sitemap";
import {createGzip} from "zlib";
import {getClientIp} from "../../utils/utils";
import {AdClick} from "@spaceread/database/entity/AdClick";
import {Professor} from "@spaceread/database/entity/professor/Professor";
import {Course} from "@spaceread/database/entity/course/Course";

export const redirectAd = async (req: Request, res: Response) => {
    res.redirect("https://wa.me/qr/37BIBC2LRMFRB1");

    const address = getClientIp(req);

    if (!address) return;

    const adClickRepo = AppDataSource.getRepository(AdClick);

    let adClick = await adClickRepo.findOne({ where: { ip_address: address } });
    if (!adClick) {
        adClick = adClickRepo.create({ ip_address: address });
    }

    adClick.last_visit = new Date();
    adClick.visits = (adClick.visits || 0) + 1;

    await adClickRepo.save(adClick);
};

export const siteMap = async (req: Request, res: Response) => {
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
}