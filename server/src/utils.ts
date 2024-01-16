import {createReadStream, createWriteStream} from "fs";
import {createGzip} from "zlib";
import jwt from "jsonwebtoken";
import {JWT_SECRET} from "./app";

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


export const ALLOWED_APPLICATION_TYPES = [
    "application/pdf",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "text/csv",
    "application/gzip",
    "application/zip",
    "application/x-7z-compressed",
    "application/vnd.rar",
    "application/x-compressed"

]

export const ALLOWED_TYPES = [
    "image",
    "audio",
    "video"
]

export const ALLOWED_EMAILS = [process.env.DASHBOARD_EMAIL_1, process.env.DASHBOARD_EMAIL_2];

interface JwtPayload {
    email: string;
    name: string;
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