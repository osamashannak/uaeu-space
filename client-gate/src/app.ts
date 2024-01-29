import env from "dotenv";
env.config();

import express from 'express';
import * as fs from "fs";
import cookies from "cookie-parser";
import * as crypto from "crypto";
import * as zlib from "zlib";
import {AppDataSource} from "./orm/data-source";
import requestIp from "request-ip";
import {isbot} from "isbot";
import {createClient} from 'redis';
import {Session} from "./orm/entity/Session";
import {Guest} from "./orm/entity/User";
import {generateAuthSession, isAuthValid, RedisSession, setHeaders, setSessionCookie} from "./utils";

const app = express();
const client = createClient();

const SessionRepository = AppDataSource.getRepository(Session);
const GuestRepository = AppDataSource.getRepository(Guest);

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

    console.log("Address: " + address)

    let session = req.cookies.sid ? await SessionRepository.findOne({where: {token: req.cookies.sid}}) : null;

    let guestSession = req.cookies.gid ? await GuestRepository.findOne({where: {id: req.cookies.sid}}) : null;

    let authUsername = req.cookies.auth ? JSON.parse(<string>await client.get(req.cookies.auth)) as RedisSession : null;

    console.log({
        session: req.cookies.sid,
        guestSession: req.cookies.gid,
        authUsername: req.cookies.auth
    })

    console.log({
        session: session,
        guestSession: guestSession,
        authUsername: authUsername
    })

    console.log("Auth Username: " + authUsername)

    if (guestSession && !session && !authUsername) {
        next();
        return;
    }

    if (!authUsername && session) {
        res.clearCookie('sid');
        next();
    }

    if (authUsername) {

        if (session && isAuthValid(session, authUsername.username)) {
            next();
            return;
        }

        const token = await generateAuthSession(authUsername.username, address, req);

        setSessionCookie(res, "sid", token);

        if (guestSession) {
            await GuestRepository.delete(guestSession.id);
        }

        next();
        return;
    }

    const guest = new Guest();

    guest.ipAddress = address;
    guest.userAgent = req.headers['user-agent'] ?? "";
    guest.token = crypto.randomBytes(20).toString('hex');

    await GuestRepository.save(guest);

    setSessionCookie(res, "gid", guest.token);

    next();

});


app.get('*', function (req, res) {
    /**
     * Cookies:
     * 1. Session cookie for everyone (Expires after exiting session or after 1 day, whichever comes first)
     * 2. Auth cookie for logged-in users (Expires after 1 year or after logging out)
     *
     *
     * Request Header for Authenticated Users:
     * 1. CSRF Token
     *
     */

    fs.readFile(__dirname + '/views/default.html', 'utf8', (err, text) => {
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

