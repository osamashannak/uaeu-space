import {Request, Response} from 'express';
import {AppDataSource} from "../orm/data-source";
import {Course} from "../orm/entity/course/Course";
import {Equal, ILike} from "typeorm";
import {CourseFile} from "../orm/entity/course/CourseFile";
import {FileAccessToken} from "../orm/entity/course/FileAccessToken";
import requestIp from "request-ip";
import {generateToken, getFileURL, uploadBlob} from "../azure";
import {promisify} from "util";
import * as fs from "fs";
import {compressFile} from "../utils";
import Client from "../orm/entity/Client";

const unlinkAsync = promisify(fs.unlink)

export const find = async (req: Request, res: Response) => {
    const params = req.query;

    if (!params.tag) {
        res.status(400).json({"request": "failed"});
        return;
    }

    const clientKey = req.headers['client-key'] as string;

    if (!clientKey) {
        res.status(400).json({"request": "failed"});
        return;
    }

    const client = await AppDataSource.getRepository(Client).findOne({
        where: {client_key: Equal(clientKey)},
    });

    if (!client) {
        res.status(400).json({"request": "failed"});
        return;
    }

    const courseRepo = AppDataSource.getRepository(Course);

    const course = await courseRepo.findOne({
        where: {tag: ILike(params.tag as string), files: {visible: true}},
        relations: ["files"],
        order: {files: {created_at: "desc"}},
    });

    if (!course) {
        res.status(404).json({error: "Course not found."});
        return;
    }

    if (!client.visits.find(value => value === course.tag)) {
        client.visits.push(course.tag);
        await AppDataSource.getRepository(Client).save(client);
        course.views += 1;
        await courseRepo.save(course);
    }

    res.status(200).json({course: course});
}


export const getAll = async (req: Request, res: Response) => {

    const courses = await AppDataSource.getRepository(Course).find({
        select: {name: true, tag: true}, order: {views: "desc"}
    });

    res.setHeader("5184000", "max-age=5184000, immutable");

    res.status(200).json({courses: courses});

}

export const uploadFile = async (req: Request, res: Response) => {
    const file = req.file;

    const clientKey = req.headers['client-key'] as string;

    if (!clientKey) {
        res.status(400).json({error: "Invalid client key"});
        return;
    }

    const client = await AppDataSource.getRepository(Client).findOne({
        where: {client_key: Equal(clientKey)},
    });

    if (!client) {
        res.status(400).json({error: "Invalid client key"});
        return;
    }

    if (!(file && req.body.tag && req.body.name)) {
        res.status(400).json({error: "File type is not allowed"});
        return;
    }

    const filePath = await compressFile(file.path);

    if (!filePath) {
        res.status(400).json({error: "Failed to upload file."});
        return;
    }

    const course = await AppDataSource.getRepository(Course).findOne({where: {tag: req.body.tag}});

    if (course == null) {
        res.status(400).json({error: "Uh-oh. An error occurred."});
        return;
    }

    const blobName = await uploadBlob(req.body.name, filePath, file.mimetype);

    console.log([blobName, req.body.tag]);
    await unlinkAsync(file.path);
    await unlinkAsync(filePath);

    const courseFile = new CourseFile();
    courseFile.course = course;
    courseFile.blob_name = blobName;
    courseFile.size = file.size;
    courseFile.name = req.body.name;
    courseFile.type = file.mimetype;
    courseFile.client = client;

    await AppDataSource.getRepository(CourseFile).save(courseFile);

    // todo remove this later
    fs.writeFile('today.txt', `${[blobName, req.body.tag]}\n`, {flag: 'a'}, err => {
        if (err) {
            console.error(err);
        }
    });

    res.status(200).json({result: "success"});

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

    courseFile.downloads += 1;

    await AppDataSource.getRepository(CourseFile).save(courseFile);

    const fileUrl = getFileURL(courseFile.blob_name, fileAccessToken.url)

    res.status(200).redirect(fileUrl);

}

