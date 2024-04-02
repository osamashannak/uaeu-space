import {createReadStream, createWriteStream} from "fs";
import {createGzip} from "zlib";
import {CommentBody} from "./typed/professor";
import {Request, Response, NextFunction} from "express";
import {AppDataSource, RedisClient} from "./app";
import {Guest} from "@spaceread/database/entity/user/Guest";
import {User} from "@spaceread/database/entity/user/User";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

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

export const createAssessment = async (token: string | undefined) => {

    if (!token) {
        return false;
    }

    let response;

    try {
        const request = await fetch(`https://recaptchaenterprise.googleapis.com/v1/projects/uaeu-space/assessments?key=${GOOGLE_API_KEY}`, {
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
        body.comment = body.comment.trimEnd();

        if ([...body.comment].length > 350) {
            return null;
        }
    }

    if (!Number.isInteger(body.score) || parseInt(body.score) < 1 || parseInt(body.score) > 5) {
        return null;
    }

    return body;
}

export interface RedisSession {
    username: string,
    csrfToken: string,
    expiration: number
}

export const getCredentials = async (req: Request, res: Response, next: NextFunction) => {

    const sid = req.cookies.sid;
    let authProfile = req.cookies.auth ? JSON.parse(<string>await RedisClient.get(req.cookies.auth)) as RedisSession : null;

    if (authProfile && sid) {

        const csrf = req.headers['x-csrf-token'];

        if (csrf === authProfile.csrfToken) {
            const user = await AppDataSource.getRepository(User).findOne({where: {username: authProfile.username}});

            if (user) {
                res.locals.user = user;
                next();
            }
        }

    }

    const guest = await AppDataSource.getRepository(Guest).findOne({where: {token: req.cookies.gid}});

    if (guest) {
        res.locals.user = guest;
        next();
    }

    next();

}