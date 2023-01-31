import {Request, Response} from 'express';
import {AppDataSource} from "../orm/data-source";
import {Course} from "../orm/entity/Course";
import {Equal, ILike} from "typeorm";
import {File} from "../orm/entity/File";
import {FileRating} from "../orm/entity/FileRating";


export const upload = async (req: Request, res: Response) => {
    const body = req.body;

    const courseId = body.courseId;
    /**
     * TODO uploading file to the mongodb db
     * expected para:
     * course
     * file bin
     */
}

export const getFiles = async (req: Request, res: Response) => {
    /**
     * TODO get all files (approved) that are stored in the db for set course
     * expected para:
     * courseId
     */
}

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
    console.log(body)

    if (!body.fileReference || body.positive === null || !body.request_key) {
        res.status(400).json();
        return;
    }

    const file = await AppDataSource.getRepository(File).findOne({
        where: {reference: Equal(body.fileReference)}
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

    if (!params.fileReference) {
        res.status(400).json();
        return;
    }

    const file = await AppDataSource.getRepository(File).findOne({
        where: {reference: Equal(params.fileReference as string)},
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
