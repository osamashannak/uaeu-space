import {Response, Request} from "express";
import crypto from "crypto";
import {Session} from "@spaceread/database/entity/user/Session";
import {SessionRepository, UserRepository} from "./app";


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


export function isAuthValid(session: any, authUsername: string, address: string) {
    return session.user.username.toLowerCase() === authUsername.toLowerCase() && session.ipAddress === address;
}

export async function generateAuthSession(username: string, address: string, req: Request) {
    const token = crypto.randomBytes(20).toString('hex');
    const user = await UserRepository.findOne({where: {username: username}});
    const newSession = new Session();
    newSession.token = token;
    newSession.ip_address = address;
    newSession.user_agent = req.headers['user-agent'] ?? "";
    newSession.user = user!;
    newSession.date_history = [new Date().toISOString()];
    SessionRepository.save(newSession).then();
    return token;
}

export function setSessionCookie(res: Response, name: string, value: string, sessionOnly: boolean) {
    const options = {
        httpOnly: true,
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24),
        maxAge: 1000 * 60 * 60 * 24,
        domain: process.env.DOMAIN,
        secure: true
    } as {
        httpOnly: boolean,
        expires: Date | undefined,
        maxAge: number | undefined,
        domain: string | undefined,
        secure: boolean
    }

    if (sessionOnly) {
        delete options.expires;
        delete options.maxAge;
    }

    res.cookie(name, value, options);
}