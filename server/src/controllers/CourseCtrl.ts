import {Request, Response} from 'express';
import {AppDataSource} from "../orm/data-source";
import {Course} from "../orm/entity/Course";
import {Equal, ILike} from "typeorm";
import {CourseFile} from "../orm/entity/CourseFile";
import {FileRating} from "../orm/entity/FileRating";
import {FileAccessToken} from "../orm/entity/FileAccessToken";
import requestIp from "request-ip";
import {generateToken, getFileURL, uploadBlob} from "../azure";
import {promisify} from "util";
import * as fs from "fs";
import {compressFile} from "../utils";

const unlinkAsync = promisify(fs.unlink)

export const find = async (req: Request, res: Response) => {
    const params = req.query;

    if (!params.tag) {
        res.status(400).json({"request": "failed"});
        return;
    }

    const course = await AppDataSource.getRepository(Course).findOne({
        where: {tag: ILike(params.tag as string)},
        relations: ["files"],
        order: {files: {created_at: "desc"}},
    });

    if (!course) {
        res.status(404).json({error: "Course not found."});
        return;
    }

    course.files = course.files.filter(value => value.visible);

    if (params.viewed && params.viewed === "false") {
        const userRepo = AppDataSource.getRepository(Course);
        course.views += 1;
        await userRepo.save(course);
    }

    res.status(200).json({course: course});
}


export const getAll = async (req: Request, res: Response) => {

    const courses = await AppDataSource.getRepository(Course).find({
        select: {name: true, tag: true}, order: {views: "desc"}
    });

    res.status(200).json({courses: courses});

}

export const rateFile = async (req: Request, res: Response) => {
    const body = req.body;

    if (!body.id || body.positive === null || !body.request_key) {
        res.status(400).json();
        return;
    }

    const file = await AppDataSource.getRepository(CourseFile).findOne({
        where: {id: Equal(body.id as number)}
    });

    if (!file) {
        res.status(200).json({error: "File not found."});
        return;
    }

    const fileRating = new FileRating();

    fileRating.request_key = body.request_key;
    fileRating.is_positive = body.positive;
    fileRating.file = file;

    await AppDataSource.getRepository(FileRating).save(fileRating);

    res.status(200).json({result: "success"});
}

export const removeFileRating = async (req: Request, res: Response) => {
    const body = req.body;


    if (!body.request_key) {
        res.status(400).json();
        return;
    }

    const fileRating = await AppDataSource.getRepository(FileRating).findOne({
        where: {request_key: Equal(body.request_key)}
    });

    if (!fileRating) {
        console.log(body)
        res.status(200).json({error: "File rating not found."});
        return;
    }

    await AppDataSource.getRepository(FileRating).remove(fileRating);

    res.status(200).json({result: "success"});
}

export const getFileRatings = async (req: Request, res: Response) => {
    const params = req.query;

    if (!params.id) {
        res.status(400).json();
        return;
    }

    const file = await AppDataSource.getRepository(CourseFile).findOne({
        where: {id: Equal(parseInt(params.id as string))},
        relations: ["ratings"]
    });

    if (!file) {
        res.status(200).json({error: "File not found."});
        return;
    }

    let likes = 0;
    let dislikes = 0;

    file.ratings.forEach(value => {
        value.is_positive ? likes += 1 : dislikes += 1;
    });

    res.status(200).json({likes: likes, dislikes: dislikes});
}

interface UploadFilesBody {
    file: File

}

export const uploadFile = async (req: Request, res: Response) => {
    const file = req.file;

    if (!(file && req.body.tag && req.body.name)) {
        res.status(400).json({error: "File type is not allowed"});
        return;
    }

    const filePath = await compressFile(file.path);

    if (!filePath) {
        res.status(400).json({});
        return;
    }


    const blobName = await uploadBlob(req.body.name, filePath, file.mimetype);

    console.log([blobName, req.body.tag]);
    await unlinkAsync(file.path);
    await unlinkAsync(filePath);

    const courseFile = new CourseFile();
    courseFile.course = req.body.tag;
    courseFile.blob_name = blobName;
    courseFile.size = file.size;
    courseFile.name = req.body.name;
    courseFile.type = file.mimetype;

    await AppDataSource.getRepository(CourseFile).save(courseFile);

    fs.writeFile('today.txt', `${[blobName, req.body.tag]}\n`, {flag: 'w+'}, err => {
        if (err) {
            console.error(err);
        }
        // file written successfully
    });

}

export const getFile = async (req: Request, res: Response) => {

    const params = req.query;

    let address = requestIp.getClientIp(req);

    if (!(params.id && address)) {
        res.status(400).json();
        return;
    }

    if (address.includes(":")) {
        address = address.split(":").slice(-1).pop()!;
    }

    let fileAccessToken = await AppDataSource.getRepository(FileAccessToken).findOne({
        where: {
            client_address: address
        }
    });

    if (!fileAccessToken || fileAccessToken.expires_on < new Date()) {
        if (!address) {
            res.status(401).json();
            return
        }

        const queryParams = generateToken(address);

        console.log(queryParams)

        fileAccessToken = new FileAccessToken();

        fileAccessToken.url = queryParams.toString();
        fileAccessToken.expires_on = queryParams.expiresOn!;
        fileAccessToken.client_address = address;

        await AppDataSource.getRepository(FileAccessToken).save(fileAccessToken);
    }

    let courseFile = await AppDataSource.getRepository(CourseFile).findOne({
        where: {
            id: Equal(parseInt(params.id as string))
        }
    });

    if (!(courseFile && courseFile.visible)) {
        res.status(404).json({});
        return;
    }

    const fileUrl = getFileURL(courseFile.blob_name, fileAccessToken.url)

    res.status(200).redirect(fileUrl);

}

