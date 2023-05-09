import {createReadStream, createWriteStream} from "fs";
import {createGzip} from "zlib";
import requestIp from "request-ip";
import {Request} from 'express';
import Client from "./orm/entity/Client";
import {Repository} from "typeorm";
import {AppDataSource} from "./orm/data-source";
import {Rating} from "./orm/entity/Rating";


export const compressFile = async (filePath: string) => {
    const stream = createReadStream(filePath);
    const newPath = `${filePath}.gz`;
    return await new Promise<string>((resolve, reject) => {
        stream
            .pipe(createGzip())
            .pipe(createWriteStream(newPath))
            .on("finish", () => resolve(newPath))
            .on('error', () => reject(null));
    });
};

export const getUserDetails = (req: Request) => {
    let address = requestIp.getClientIp(req);

    if (address && address.includes(":")) {
        address = address.split(":").slice(-1).pop()!;
    }

    return {
        user_agent: req.headers['user-agent'] ?? "unknown",
        ip: address ?? "unknown",
    };
}


export const ALLOWED_APPLICATION_TYPES = [
    "application/pdf",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
    "application/gzip",
    "application/zip",
    "application/x-7z-compressed",
    "application/vnd.rar"
]

export const ALLOWED_TYPES = [
    "image",
    "audio",
    "video"
]

export enum LogAction {
    AUTH = 'auth',
    FILE_UPLOAD = 'file_upload',
    FILE_DOWNLOAD = 'file_download',
    NEW_REVIEW = 'new_review',
    FLAG_REVIEW = 'flag_review',
    FILE_RATING_ADDED = 'file_rating_added',
    REVIEW_RATING_ADDED = 'review_rating_added'
}

export const migrateDate = async (client: Client, clientRepo: Repository<Client>, data: (string | { key: string; value: string; })[]) => {

    const ratingRepository = AppDataSource.getRepository(Rating);

    const visits = client.visits;

    for (let item of data) {

        if (typeof item === "string") {

            visits.push(item.replace("-exist", ""));

        } else {

            const check = await ratingRepository.findOne({where: {id: item.value}});

            if (!check || check.client) continue;

            await ratingRepository.update({id: item.value}, {client: client});

        }
    }

    await clientRepo.update({client_key: client.client_key}, {visits: visits});
}

export const detectRobot = (userAgent: string): boolean => {
    const robots = new RegExp(([
        /bot/, /spider/, /crawl/,                               // GENERAL TERMS
        /APIs-Google/, /AdsBot/, /Googlebot/,                   // GOOGLE ROBOTS
        /mediapartners/, /Google Favicon/,
        /FeedFetcher/, /Google-Read-Aloud/,
        /DuplexWeb-Google/, /googleweblight/,
        /bing/, /yandex/, /baidu/, /duckduck/, /yahoo/,           // OTHER ENGINES
        /ecosia/, /ia_archiver/,
        /facebook/, /instagram/, /pinterest/, /reddit/,          // SOCIAL MEDIA
        /slack/, /twitter/, /whatsapp/, /youtube/,
        /semrush/,                                            // OTHER
    ] as RegExp[]).map((r) => r.source).join("|"), "i");     // BUILD REGEXP + "i" FLAG

    return robots.test(userAgent);
};
