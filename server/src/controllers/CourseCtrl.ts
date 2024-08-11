import {Request, Response} from 'express';
import requestIp from "request-ip";
import {promisify} from "util";
import * as fs from "fs";
import {compressFile, verifyJWTToken} from "../utils";
import {AppDataSource, Azure, VTClient} from "../app";
import {AzureClient} from "../azure";
import {Course} from "@spaceread/database/entity/course/Course";
import {CourseFile} from "@spaceread/database/entity/course/CourseFile";
import {FileAccessToken} from "@spaceread/database/entity/FileAccessToken";

const unlinkAsync = promisify(fs.unlink);

const cache = new Map<string, number>();

export const find = async (req: Request, res: Response) => {
    const params = req.query;

    if (!params.tag) {
        res.status(400).json({"request": "failed"});
        return;
    }

    const courseTag = (params.tag as string);

    const course = await AppDataSource.getRepository(Course).findOne({
        where: {tag: courseTag },
        relations: ["files"],
        order: {files: {created_at: "desc"}},
    });

    if (!course) {
        res.status(404).json({error: "Course not found."});
        return;
    }

    const {views, ...courseWithoutViews} = course;

    const newCourse = {
        ...courseWithoutViews,
        files: course.files
            .filter(value => value.visible)
            .map(({ guest, reviewed, downloads, visible, ...file}) => {
                if (!cache.has(file.id.toString())) {
                    cache.set(file.id.toString(), downloads);
                    setTimeout(() => cache.delete(file.id.toString()), 86400000);
                }

                return {
                    ...file,
                    downloads: cache.get(file.id.toString())
                };
            })
    };

    res.status(200).json({course: newCourse});
}


export const getAll = async (req: Request, res: Response) => {

    const courses = await AppDataSource.getRepository(Course).find({
        select: {name: true, tag: true}, order: {views: "desc"}
    });

    res.status(200).json({courses: courses});

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

    const blobName = await Azure.uploadMaterial(req.body.name, filePath, file.mimetype);

    const course = await AppDataSource.getRepository(Course).findOne({where: {tag: req.body.tag}});

    if (!course) {
        res.status(400).json({error: "Course not found."});
        return;
    }

    await VTClient.addToQueue(file.path, blobName);

    await unlinkAsync(filePath);

    const courseFile = new CourseFile();
    courseFile.course = course;
    courseFile.blob_name = blobName;
    courseFile.size = file.size;
    courseFile.name = req.body.name;
    courseFile.type = file.mimetype;

    await AppDataSource.getRepository(CourseFile).save(courseFile);

    fs.writeFile('today.txt', `${[blobName, req.body.tag]}\n`, {flag: 'a'}, err => {
        if (err) {
            console.error(err);
        }
        // file written successfully
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
    
    if (!fileAccessToken) {
        const queryParams = Azure.generateToken(address, "materials");
        
        fileAccessToken = new FileAccessToken();
        
        fileAccessToken.url = queryParams.toString();
        fileAccessToken.expires_on = queryParams.expiresOn!;
        fileAccessToken.client_address = address;
        
        await AppDataSource.getRepository(FileAccessToken).save(fileAccessToken);
    } else if (fileAccessToken.expires_on < new Date()) {
        const queryParams = Azure.generateToken(address, "materials");
        
        fileAccessToken.url = queryParams.toString();
        fileAccessToken.expires_on = queryParams.expiresOn!;
        
        await AppDataSource.getRepository(FileAccessToken).save(fileAccessToken);
    }

    let courseFile = await AppDataSource.getRepository(CourseFile).findOne({
        where: {
            id: parseInt(params.id as string)
        }
    });

    const token = params.token as string | undefined;

    const decodedToken = token ? verifyJWTToken(token) : undefined;

    if (!courseFile || (!courseFile.visible && !decodedToken)) {
        res.status(404).json({});
        return;
    }

    courseFile.downloads += 1;

    await AppDataSource.getRepository(CourseFile).save(courseFile);

    const fileUrl = AzureClient.getFileURL(courseFile.blob_name, "materials", fileAccessToken.url);

    res.status(200).redirect(fileUrl);

}

