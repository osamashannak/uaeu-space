import {createReadStream, createWriteStream} from "fs";
import {createGzip} from "zlib";


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