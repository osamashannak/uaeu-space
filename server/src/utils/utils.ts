import {createReadStream, createWriteStream} from "fs";
import {createGzip} from "zlib";
import {ReplyBody} from "../typed/professor";
import {isInSubnet} from 'is-in-subnet';
import * as fs from "fs";
import * as express from "express";
import {config} from "../config";
import {Request} from "express";
import requestIp from "request-ip";
import {IPV4_UAEU_SUBNETS, IPV6_UAEU_SUBNETS} from "./constants";


export const getClientIp = (req: Request): string | null => {
    let address = requestIp.getClientIp(req);
    return address && address.includes(":") ? address.split(":").slice(-1).pop()! : address;
};

export async function compressFile(filePath: string) {
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


export function isUAEUIp(ip: string| null) {
    if (!ip) return false;

    if (!ip.includes(":")) {
        return isInSubnet(ip, IPV4_UAEU_SUBNETS);
    }

    return isInSubnet(ip, IPV6_UAEU_SUBNETS);
}


export function validateReply(body: ReplyBody) {
    if (!body.reviewId || (!body.content.comment && !body.content.gif)) {
        return null;
    }

    if (body.content.gif) {
        body.content.comment = "";
        return body;
    }

    body.content.comment = body.content.comment.trim();

    if ([...body.content.comment].length > 350) {
        return null;
    }

    return body;
}

export function generateUsername() {
    const data = fs.readFileSync('random_words_generator.json', 'utf8');
    const words = JSON.parse(data);

    const adjective = words['adjectives'][Math.floor(Math.random() * words['adjectives'].length)] as string;
    const noun = words['nouns'][Math.floor(Math.random() * words['nouns'].length)] as string;

    return `${adjective.charAt(0).toUpperCase() + adjective.slice(1)}${noun.charAt(0).toUpperCase() + noun.slice(1)}`;
}

export function setHeaders(req: express.Request, res: express.Response) {
    res.setHeader("Access-Control-Allow-Origin", config.ALLOWED_ORIGIN);
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Authorization, x-csrf-token"
    );
}

export function omit<T extends Record<string, any>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> {
    const result = { ...obj };
    keys.forEach((key) => {
        delete result[key];
    });
    return result;
}