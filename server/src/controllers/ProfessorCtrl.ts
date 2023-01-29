import {Request, Response} from 'express';
import {AppDataSource} from "../orm/data-source";
import {Professor} from "../orm/entity/Professor";
import {Equal} from "typeorm";
import {Review} from "../orm/entity/Review";


type ProfessorFindBody = {
    email: string
}

type RateBody = {
    review: {
        author: string,
        positive: boolean,
        comment: string,
        score: number
    },
    professor: string
}

export const rate = async (req: Request, res: Response) => {
    const body: RateBody = req.body;

    const professor = await AppDataSource.getRepository(Professor).findOne({
        where: {email: Equal(body.professor)}
    });

    if (!professor) {
        res.status(200).json({success: "failed-nop"});
        return;
    }

    const review = new Review();

    review.author = body.review.author || "Anonymous";
    review.comment = body.review.comment;
    review.score = body.review.score;
    review.positive = body.review.positive;
    review.professor = professor;

    await AppDataSource.getRepository(Review).save(review);

    res.status(200).json({result: "success"});
}

export const getRating = async (req: Request, res: Response) => {

    const body: ProfessorFindBody = req.body;


    const professor = await AppDataSource.getRepository(Professor).findOne({
        where: {email: Equal(body.email)},
        relations: ["reviews"],
        order: {reviews: {id: "asc"}}
    });


    if (professor === null) {
        res.status(404).json({error: "ProfessorBlock not found."});
        return;
    }

    res.status(200).json({reviews: professor.reviews || []});

}

export const find = async (req: Request, res: Response) => {

    const params = req.query;

    const professor = await AppDataSource.getRepository(Professor).findOne({
        where: {email: Equal(params.email!.toString())},
        relations: ["reviews"],
        order: {reviews: {id: "desc"}},

    });

    if (professor === null) {
        res.status(404).json({error: "ProfessorBlock not found."});
        return;
    }

    res.status(200).json({professor: professor});
}

export const getAll = async (req: Request, res: Response) => {

    const professors = await AppDataSource.getRepository(Professor).find({select: {name: true, email: true}});

    res.status(200).json({professors: professors});

}