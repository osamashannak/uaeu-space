import env from "dotenv";
env.config();

import express from 'express';
import * as fs from "fs";
import cookies from "cookie-parser";
import * as crypto from "crypto";
import * as zlib from "zlib";
import requestIp from "request-ip";
import {isbot} from "isbot";
import {createClient} from 'redis';
import {generateAuthSession, isAuthValid, RedisSession, setHeaders, setSessionCookie} from "./utils";
import {Session} from "@spaceread/database/entity/user/Session";
import {Guest} from "@spaceread/database/entity/user/Guest";
import {createDataSource} from "@spaceread/database";
import {User} from "@spaceread/database/entity/user/User";

const app = express();
const client = createClient();
export const AppDataSource = createDataSource({
    host: process.env.POSTGRES_HOST,
    username: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    database: process.env.POSTGRES_DB,
    ssl: false,
});


export const SessionRepository = AppDataSource.getRepository(Session);
export const GuestRepository = AppDataSource.getRepository(Guest);
export const UserRepository = AppDataSource.getRepository(User);

app.use(cookies());

app.use(function (req, res, next) {
    console.log("Connection Started!")
    setHeaders(res);
    console.log("Headers Set!")
    next();
});

app.use(async function (req, res, next) {
    if (isbot(req.headers['user-agent'])) {
        next();
    }

    let address = requestIp.getClientIp(req);

    if (!address) {
        res.status(444).send();
        return;
    }

    if (address.includes(":")) {
        address = address.split(":").slice(-1).pop()!;
    }

    let session = req.cookies.sid ? await SessionRepository.findOne({where: {token: req.cookies.sid}, relations: ["user"]}) : null;

    let guestSession = req.cookies.gid ? await GuestRepository.findOne({where: {token: req.cookies.gid}}) : null;

    let authUsername = req.cookies.auth ? JSON.parse(<string>await client.get(req.cookies.auth)) as RedisSession : null;

    if (guestSession && !session && !authUsername) {
        req.cookies.sid && res.clearCookie('sid');
        req.cookies.auth && res.clearCookie('auth');

        next();

        if (!guestSession.ipAddressHistory.includes(address)) {
            guestSession.ipAddressHistory.push(address);
        }

        guestSession.dateHistory.push(new Date().toISOString());

        await GuestRepository.save(guestSession);

        return;
    }

    if (!authUsername && session) {
        res.clearCookie('sid');
    }

    if (authUsername) {

        if (session && isAuthValid(session, authUsername.username, address)) {
            next();
            session.dateHistory.push(new Date().toISOString());
            await SessionRepository.save(session);
            return;
        }

        const token = await generateAuthSession(authUsername.username, address, req);

        setSessionCookie(res, "sid", token, true);

        next();
        return;
    }

    const guest = new Guest();

    guest.ipAddressHistory = [address];
    guest.userAgent = req.headers['user-agent'] ?? "";
    guest.token = crypto.randomBytes(20).toString('hex');
    guest.dateHistory = [new Date().toISOString()];

    await GuestRepository.save(guest);

    setSessionCookie(res, "gid", guest.token, false);

    next();

});

app.get('*', function (req, res) {
    fs.readFile('./views/default.html', 'utf8', (err, text) => {
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
    console.log('Client Gate is connecting to Database...')
    await AppDataSource.initialize();

    console.log('Client Gate is connecting to Redis...')

    await client.connect();

    app.listen(3000);
    console.log('Client Gate is running on port 3000');
})()

