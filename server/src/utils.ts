import {createReadStream, createWriteStream} from "fs";
import {createGzip} from "zlib";
import requestIp from "request-ip";
import {Request} from 'express';


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

export const getUserDetails = (req: Request) => {
    let address = requestIp.getClientIp(req);

    if (address && address.includes(":")) {
        address = address.split(":").slice(-1).pop()!;
    }

    return JSON.stringify({
        user_agent: req.headers['user-agent'],
        ip: address
    });
}


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
    "application/vnd.rar"
]

export const ALLOWED_TYPES = [
    "image",
    "audio",
    "video"
]