import {Request, Response} from 'express';
import {AppDataSource} from "../orm/data-source";
import {Course} from "../orm/entity/Course";
import {Equal, ILike} from "typeorm";
import {CourseFile} from "../orm/entity/CourseFile";
import {FileRating} from "../orm/entity/FileRating";
import {FileAccessToken} from "../orm/entity/FileAccessToken";
import {generateToken, getFileURL} from "../azure";


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

    if (params.unique && params.unique === "true") {
        await course.addView(AppDataSource);
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

    if (!body.blobName || body.positive === null || !body.request_key) {
        res.status(400).json();
        return;
    }

    const file = await AppDataSource.getRepository(CourseFile).findOne({
        where: {blob_name: Equal(body.blobName)}
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

    if (!params.blobName) {
        res.status(400).json();
        return;
    }

    const file = await AppDataSource.getRepository(CourseFile).findOne({
        where: {blob_name: Equal(params.blobName as string)},
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
    files: File[]

}

export const uploadFiles = async (req: Request, res: Response) => {
    // get files type
    // get files size

    const body: UploadFilesBody = req.body;
    const address = req.socket.remoteAddress;

    if (!('files' in body && !address)) {
        res.status(401).json();
        return;
    }

    const validFiles = []




}

export const getFile = async (req: Request, res: Response) => {

    const params = req.query;
    const address = req.socket.remoteAddress; // implement a way to make sure its available

    if (!params.blobName) {
        res.status(400).json();
        return;
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

        fileAccessToken = new FileAccessToken();

        fileAccessToken.url = queryParams.toString();
        fileAccessToken.expires_on = queryParams.expiresOn!;
        fileAccessToken.client_address = address;

        await AppDataSource.getRepository(FileAccessToken).save(fileAccessToken);
    }

    const fileUrl = getFileURL((params.blobName as string), fileAccessToken.url)

    res.status(200).json({url: fileUrl})

}

