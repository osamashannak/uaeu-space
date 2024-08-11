import env from "dotenv";

env.config();

import express from 'express';
import * as fs from "fs";
import cookies from "cookie-parser";
import * as zlib from "zlib";
import {setHeaders, setSessionCookie} from "./utils";
import {isbot} from "isbot";
import requestIp from "request-ip";
import {createDataSource} from "@spaceread/database";
import crypto from "crypto";
import {Guest, IPAddress} from "@spaceread/database/entity/user/Guest";
import {ReviewRating} from "@spaceread/database/entity/professor/ReviewRating";
import {getCountryFromIp} from "./api";

const app = express();
export const AppDataSource = createDataSource({
    host: process.env.POSTGRES_HOST,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
});

export const GuestRepository = AppDataSource.getRepository(Guest);
export const IPRepository = AppDataSource.getRepository(IPAddress);

app.use(cookies());

app.use(function (req, res, next) {
    console.log("Connection Started!")
    setHeaders(res);
    next();
});

app.use(async function (req, res, next) {
    if (isbot(req.headers['user-agent'])) {
        next();
        return;
    }

    let address = requestIp.getClientIp(req);
    console.log("Address: ", address)

    if (!address) {
        res.status(444).send();
        return;
    }

    if (address.includes(":")) {
        address = address.split(":").slice(-1).pop()!;
    }

    let guest = req.cookies.gid ? await GuestRepository.findOne({where: {token: req.cookies.gid}, relations: ["ip_history"]}) : null;


    const date = new Date().toISOString();

    if (guest) {

        const lastIp: IPAddress | undefined = guest.ip_history[guest.ip_history.length - 1];

        if (!lastIp || lastIp.ip_address !== address) {
            const ip = new IPAddress();

            ip.ip_address = address;
            ip.guest = guest;
            ip.country = await getCountryFromIp(address);

            await IPRepository.save(ip);
        }

        guest.date_history.push(date);

        await GuestRepository.save(guest);

    } else {
        guest = new Guest();

        guest.user_agent = req.headers['user-agent'] ?? "";
        guest.token = crypto.randomBytes(20).toString('hex');
        guest.date_history = [new Date().toISOString()];
        guest.rated_professors = ["~"];

        await GuestRepository.save(guest);

        const ip = new IPAddress();

        ip.ip_address = address;
        ip.guest = guest;
        ip.country = await getCountryFromIp(address);

        await IPRepository.save(ip);


        setSessionCookie(res, "gid", guest.token, false);
    }

    next();

    let mig = req.query.mig;

    if (mig && typeof mig === "string") {
        mig = atob(mig);

        try {
            mig = JSON.parse(mig) as { key: string, value: string }[];

            for (const {key, value} of mig) {

                if (typeof key !== "string" || typeof value !== "string") {
                    continue;
                }

                if (key.endsWith("-prof")) {
                    const email = key.replace("-prof", "");

                    if (!guest!.rated_professors.includes(email)) {
                        guest!.rated_professors.push(email);
                    }

                } else if (key.startsWith("like-request") || key.startsWith("dislike-request")) {
                    console.log(key, value)
                    const rating = await AppDataSource.getRepository(ReviewRating).findOne({where: {id: value}});

                    if (rating && !rating.guest) {
                        rating.guest = guest!;

                        await AppDataSource.getRepository(ReviewRating).save(rating);
                    }
                }
            }

            await AppDataSource.getRepository(Guest).save(guest!);
        } catch (e) {
            return;
        }
    }

});

app.get('*', function (req, res) {
    let fileParts = './views/default.html';

    if (req.query.dev === 'true') {
        fileParts = './views/dev.html';
    }

    fs.readFile(fileParts, 'utf8', (err, text) => {

        if (err) {
            return res.status(503).send('Service Unavailable');
        }

        const acceptEncoding = req.headers['accept-encoding'];

        if (!acceptEncoding || !acceptEncoding.toString().match(/\b(gzip)\b/)) {
            return res.send(text);
        }

        zlib.gzip(text, (err, buffer) => {
            if (err) {
                return res.send(text);
            }

            res.setHeader('Content-Encoding', 'gzip');

            res.send(buffer);
        });
    });
});

(async function initialize() {
    await AppDataSource.initialize();
    console.log('Connected to Database.')

    app.listen(3001);
    console.log('Client Gate is running on port 3001');
})()

