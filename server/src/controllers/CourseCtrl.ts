import {Request, Response} from 'express';
import {AppDataSource} from "../orm/data-source";
import {Course} from "../orm/entity/Course";
import {Equal, ILike} from "typeorm";


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

    const courses = await AppDataSource.getRepository(Course).find({select: {name: true, tag: true}});

    res.status(200).json({courses: courses});

}