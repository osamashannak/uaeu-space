import {Response} from "express";

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
