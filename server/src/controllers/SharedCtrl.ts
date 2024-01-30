import {Request, Response} from "express";
import {AppDataSource} from "../orm/data-source";
import requestIp from "request-ip";
import {RatingType, ReviewRating} from "../orm/entity/professor/ReviewRating";
import {Review} from "../orm/entity/professor/Review";

interface RatingBody {
    id: number,
    positive: boolean
}

export const addRating = async (req: Request, res: Response) => {
    const body = req.body as RatingBody;

    let address = requestIp.getClientIp(req);

    if (!body.id || body.positive === null || !address) {
        res.status(400).json();
        return;
    }

    let rating: ReviewRating;

    const review = await AppDataSource.getRepository(Review).findOne({
        where: {id: body.id}
    });

    if (!review) {
        res.status(404).json();
        return;
    }

    rating = new ReviewRating();
    rating.review = review;
    rating.type = body.positive ? RatingType.LIKE : RatingType.DISLIKE;

    await AppDataSource.getRepository(ReviewRating).save(rating);

    res.status(200).json({result: "success"});
}

export const removeRating = async (req: Request, res: Response) => {
    const key = req.query.key as string;
    const type = req.query.type as "review" | "file";

    if (!key || !type) {
        res.status(400).json();
        return;
    }

   /* let rating = await AppDataSource.getRepository(ReviewRating).findOne({
        where: {request_key: Equal(key)}
    });

    if (!rating) {
        res.status(404).json();
        return;
    }

    await AppDataSource.getRepository(ReviewRating).remove(rating);

    res.status(200).json({result: "success"});*/
}