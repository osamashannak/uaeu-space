import {Response, Request} from "express";
import crypto from "crypto";
import {Session} from "./orm/entity/Session";
import {AppDataSource} from "./orm/data-source";
import {RegisteredUser} from "./orm/entity/User";

const SessionRepository = AppDataSource.getRepository(Session);
const RegisteredRepository = AppDataSource.getRepository(RegisteredUser);


export interface RedisSession {
    username: string,
    csrfToken: string,
    expiration: number
}

export function setHeaders(res: Response) {
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    res.setHeader('Cache-Control', 'private, no-cache, s-maxage=0, max-age=0, must-revalidate, no-store');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('X-XSS-Protection', '0');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('Vary', 'Accept-Encoding');
    res.removeHeader("X-Powered-By");
    res.removeHeader("Connection");
    res.removeHeader("Keep-Alive");
    res.removeHeader("Transfer-Encoding");
}


export function isAuthValid(session: any, authUsername: string) {
    return session.user.username !== authUsername;
}

export async function generateAuthSession(username: string, address: string, req: Request) {
    const token = crypto.randomBytes(20).toString('hex');
    const newSession = new Session();
    newSession.token = token;
    newSession.ipAddress = address;
    newSession.userAgent = req.headers['user-agent'] ?? "";
    newSession.user = (await RegisteredRepository.findOne({where: {username: username}}))!;
    SessionRepository.save(newSession).then();
    return token;
}

export function setSessionCookie(res: Response, name: string, value: string) {
    res.cookie(name, value, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        // todo secure: true
    });
}