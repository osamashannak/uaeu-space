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
import {Guest} from "@spaceread/database/entity/user/Guest";

const app = express();
export const AppDataSource = createDataSource({
    host: process.env.POSTGRES_HOST,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
});

export const GuestRepository = AppDataSource.getRepository(Guest);

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

    let guestSession = req.cookies.gid ? await GuestRepository.findOne({where: {token: req.cookies.gid}}) : null;

    if (guestSession) {
        next();

        if (!guestSession.ip_address_history.includes(address)) {
            guestSession.ip_address_history.push(address);
        }

        guestSession.date_history.push(new Date().toISOString());

        await GuestRepository.save(guestSession);

        return;
    }

    const guest = new Guest();

    guest.ip_address_history = [address];
    guest.user_agent = req.headers['user-agent'] ?? "";
    guest.token = crypto.randomBytes(20).toString('hex');
    guest.date_history = [new Date().toISOString()];

    await GuestRepository.save(guest);

    setSessionCookie(res, "gid", guest.token, false);

    next();
});

app.get('*', function (req, res) {
    fs.readFile('./views/default.html', 'utf8', (err, text) => {

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

