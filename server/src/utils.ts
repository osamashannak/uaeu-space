import {createReadStream, createWriteStream} from "fs";
import {createGzip} from "zlib";
import {CommentBody} from "./typed/professor";

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
    if (!body.professorEmail || (body.comment.length < 1 && body.attachments.length < 1) || !body.score || body.positive == undefined) {
        return null;
    }

    body.comment = body.comment.trimEnd();

    if (body.comment.length > 350) {
        return null;
    }

    if (!Number.isInteger(body.score) || parseInt(body.score) < 1 || parseInt(body.score) > 5) {
        return null;
    }

    if (body.attachments.length > 1) {
        return null;
    }

    if (body.positive == undefined) {
        return null;
    }

    return body;

}