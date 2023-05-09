import {Request, Response} from 'express';
import {AppDataSource} from "../orm/data-source";
import {Professor} from "../orm/entity/professor/Professor";
import {Equal, ILike} from "typeorm";
import {Review} from "../orm/entity/professor/Review";
import Client from "../orm/entity/Client";


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

export const review = async (req: Request, res: Response) => {

    const body: RateBody = req.body;

    const headers = req.headers;
    if (!headers['client-key']) {
        res.status(400).json({error: "Invalid client key."});
        return;
    }

    const client = await AppDataSource.getRepository(Client).findOne({
        where: {client_key: Equal(headers['client-key'] as string)},
    });

    if (!client) {
        res.status(400).json({error: "Invalid client key."});
        return;
    }

    const professor = await AppDataSource.getRepository(Professor).findOne({
        where: {email: Equal(body.professor)}
    });

    if (!professor) {
        res.status(200).json({success: "failed-nop"});
        return;
    }

    const review = new Review();

    review.author = body.review.author || "Anonymous";
    review.client = client;
    review.comment = body.review.comment;
    review.score = body.review.score;
    review.positive = body.review.positive;
    review.professor = professor;

    await AppDataSource.getRepository(Review).save(review);

    res.status(200).json({result: "success"});
}

export const getReviews = async (req: Request, res: Response) => {
    const body: ProfessorFindBody = req.body;

    const professor = await AppDataSource.getRepository(Professor).findOne({
        where: {email: Equal(body.email)},
        relations: ["reviews"],
        order: {reviews: {id: "asc"}}
    });


    if (!professor) {
        res.status(404).json({error: "Professor not found."});
        return;
    }

    res.status(200).json({reviews: professor.reviews || []});

}

export const find = async (req: Request, res: Response) => {
    const params = req.query;
    const headers = req.headers;

    if (!params.email || !headers['client-key']) {
        res.status(400).json({request: "failed"});
        return;
    }

    const client = await AppDataSource.getRepository(Client).findOne({
        where: {client_key: Equal(headers['client-key'] as string)},
    });

    if (!client) {
        res.status(400).json({error: "Invalid client key."});
        return;
    }

    const professorRepo = AppDataSource.getRepository(Professor);

    const professor = await professorRepo.findOne({
        where: {email: ILike(params.email as string), reviews: {hidden: false}},
        select: {
            email: true,
            name: true,
            college: true,
            views: true,
            reviews: {
                id: true,
                positive: true,
                comment: true,
                score: true,
                created_at: true,
                author: true,
            }
        },
        relations: ["reviews"],
        order: {reviews: {created_at: "desc"}},
    });

    if (!professor) {
        res.status(404).json({error: "Professor not found."});
        return;
    }

    const reviews = professor.reviews.map(review => {
        const likes = (review.ratings || []).filter(rating => rating.is_positive).length;
        const dislikes = (review.ratings || []).filter(rating => !rating.is_positive).length;
        return {...review, likes, dislikes};
    });

    if (!client.visits.find(value => value === professor.email)) {
        client.visits.push(professor.email);
        await AppDataSource.getRepository(Client).save(client);
        professor.views += 1;
        await professorRepo.save(professor);
    }

    res.status(200).json({
        professor: {
            email: professor.email,
            name: professor.name,
            college: professor.college,
            reviews,
        }
    });
}

export const getAll = async (req: Request, res: Response) => {
    const professors = await AppDataSource.getRepository(Professor).find({
        select: {name: true, email: true},
        order: {views: "desc"}
    });

    res.setHeader("Cache-Control", "max-age=604800");

    res.status(200).json({professors: professors});
}