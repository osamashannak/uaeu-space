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
import {User} from "@spaceread/database/entity/user/User";
import {Guest} from "@spaceread/database/entity/user/Guest";
import {IPAddress} from "@spaceread/database/entity/user/IPAddress";
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
export const UserRepository = AppDataSource.getRepository(User);

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
            ip.actor = guest;
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
        ip.actor = guest;
        ip.country = await getCountryFromIp(address);

        await IPRepository.save(ip);

    }

    setSessionCookie(res, "gid", guest.token, false);

    next();

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

