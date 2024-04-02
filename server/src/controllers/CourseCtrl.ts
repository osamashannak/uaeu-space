import {Request, Response} from 'express';
import requestIp from "request-ip";
import {promisify} from "util";
import * as fs from "fs";
import {compressFile} from "../utils";
import {AppDataSource, Azure, VTClient} from "../app";
import {AzureClient} from "../azure";
import {Course} from "@spaceread/database/entity/course/Course";
import {CourseFile} from "@spaceread/database/entity/course/CourseFile";
import {FileAccessToken} from "@spaceread/database/entity/FileAccessToken";
import {Guest} from "@spaceread/database/entity/user/Guest";
import {User} from "@spaceread/database/entity/user/User";

const unlinkAsync = promisify(fs.unlink)

export const find = async (req: Request, res: Response) => {
    const params = req.query;

    if (!params.tag) {
        res.status(400).json({success: false});
        return;
    }

    const courseRepo = AppDataSource.getRepository(Course);

    const course = await courseRepo.findOne({
        where: {tag: (params.tag as string).toLowerCase()},
        relations: ["files", "files.ratings"],
        order: {files: {created_at: "desc"}},
    });

    if (!course) {
        res.status(404).json({success: false, message: "The course is not found."});
        return;
    }

    const localUser: Guest | User | null = res.locals.user;

    const {views, ...courseWithoutViews} = course;

    const newCourse = {
        ...courseWithoutViews,
        files: course.files
            .filter(value => value.visible)
            .map(({ratings, downloads, reviewed, visible, ...file}) => {
                const likesCount = ratings.filter(rating => rating.is_positive).length;
                const dislikesCount = ratings.filter(rating => !rating.is_positive).length;

                return {
                    ...file,
                    likes: likesCount,
                    dislikes: dislikesCount
                };
            })
    };

    if (localUser && !localUser.visits.includes(course.tag)) {
        course.views += 1;
        await courseRepo.save(course);

        localUser.visits.push(course.tag);

        if (localUser instanceof Guest) {
            const guestRepo = AppDataSource.getRepository(Guest);
            await guestRepo.save(localUser);
        } else {
            const userRepo = AppDataSource.getRepository(User);
            await userRepo.save(localUser);
        }
    }

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
        res.status(400).json({success: false, message: "File type is not allowed"});
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
        res.status(400).json({success: false, message: "The course is not found."});
        return;
    }

    await VTClient.addToQueue(file.path, blobName);

    await unlinkAsync(filePath);

    const user: Guest | User = res.locals.user;

    const courseFile = new CourseFile();
    courseFile.course = course;
    courseFile.blob_name = blobName;
    courseFile.size = file.size;
    courseFile.name = req.body.name;
    courseFile.type = file.mimetype;

    if (user instanceof Guest) {
        courseFile.guest = user;
    } else {
        courseFile.user = user;
    }

    await AppDataSource.getRepository(CourseFile).save(courseFile);

    res.status(200).json({result: "success", courseFile: courseFile});

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

    if (!courseFile || !courseFile.visible) {
        res.status(404).json({});
        return;
    }

    courseFile.downloads += 1;

    await AppDataSource.getRepository(CourseFile).save(courseFile);

    const fileUrl = AzureClient.getFileURL(courseFile.blob_name, "materials", fileAccessToken.url)

    res.status(200).redirect(fileUrl);

}

