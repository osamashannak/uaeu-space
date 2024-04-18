import {createReadStream, createWriteStream} from "fs";
import {createGzip} from "zlib";
import jwt from "jsonwebtoken";
import {AppDataSource, JWT_SECRET} from "./app";
import {CommentBody} from "./typed/professor";
import {Request, Response, NextFunction} from "express";
import {Guest} from "@spaceread/database/entity/user/Guest";
import {isInSubnet} from 'is-in-subnet';


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


export const ALLOWED_EMAILS = [process.env.DASHBOARD_EMAIL_1, process.env.DASHBOARD_EMAIL_2];

interface JwtPayload {
    email: string;
    name: string;
}

const IPV4_UAEU_SUBNETS = [
    "178.250.248.0/21",
    "178.250.248.0/22",
    "178.250.248.0/23",
    "178.250.250.0/23",
    "178.250.252.0/22",
    "178.250.252.0/23",
    "178.250.254.0/23",
    "194.69.1.0/24"
]

const IPV6_UAEU_SUBNETS = [
    "2a02:1718::/32"
]

export const isUAEUIp = (ip: string| null) => {
    if (!ip) return false;

    if (!ip.includes(":")) {
        return isInSubnet(ip, IPV4_UAEU_SUBNETS);
    }

    return isInSubnet(ip, IPV6_UAEU_SUBNETS);
}

export const verifyJWTToken = (token: string) => {
    let decoded;

    try {
        decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    } catch (error) {
        return undefined;
    }

    if (!ALLOWED_EMAILS.includes(decoded.email)) {
        return undefined;
    }

    return decoded;
}

const API_KEY = process.env.GOOGLE_API_KEY;

export const createAssessment = async (token: string) => {

    let response;

    try {
        const request = await fetch(`https://recaptchaenterprise.googleapis.com/v1/projects/uaeu-space/assessments?key=${API_KEY}`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                event: {
                    token: token,
                    siteKey: process.env.GOOGLE_RECAPTCHA_SITE_KEY,
                    expectedAction: "new_review"
                }
            })
        });
        response = await request.json();
    } catch (error) {
        return false;
    }

    console.log(response)

    if (response.error || !response.tokenProperties?.valid || response.tokenProperties?.action !== "new_review") {
        return false;
    }

    return response.riskAnalysis?.score > 0.5;

}

export const validateProfessorComment = (body: CommentBody): CommentBody | null => {
    if (!body.professorEmail || (!body.comment && !body.attachments) || !body.score || typeof body.positive !== "boolean") {
        return null;
    }

    if (body.comment) {
        body.comment = body.comment.trim();

        if ([...body.comment].length > 350) {
            return null;
        }
    }

    if (!body.attachments || !Array.isArray(body.attachments)) {
        body.attachments = [];
    }

    if (body.attachments.length > 0) {
        body.attachments = body.attachments.filter((attachment: any) => typeof attachment === "string").slice(0, 4) as string[];
    }

    if (!Number.isInteger(body.score) || parseInt(body.score) < 1 || parseInt(body.score) > 5) {
        return null;
    }

    return body;
}

export const getCredentials = async (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://spaceread.net');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    const token: string | undefined = req.cookies.gid;

    if (!token) {
        next();
        return;
    }

    const guest = await AppDataSource.getRepository(Guest).findOne({
        where: {token: token},
        relations: ["course_files", "reviews", "review_rating"]
    });

    if (guest) {
        res.locals.user = guest;
    }

    next();
}
