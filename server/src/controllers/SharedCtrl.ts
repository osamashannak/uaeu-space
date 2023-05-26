import {Request, Response} from "express";
import {AppDataSource} from "../orm/data-source";
import {Review} from "../orm/entity/Review";
import {Equal} from "typeorm";
import {FileRating, Rating, ReviewRating} from "../orm/entity/Rating";
import requestIp from "request-ip";
import {CourseFile} from "../orm/entity/CourseFile";

interface RatingBody {
    id: number,
    positive: boolean,
    request_key: string,
    type: "review" | "file"
}

export const addRating = async (req: Request, res: Response) => {
    const body = req.body as RatingBody;

    let address = requestIp.getClientIp(req);

    console.log(body)
    console.log(address)

    if (!body.id || body.positive === null || !body.request_key || !body.type || !address) {
        res.status(400).json();
        return;
    }

    let rating: ReviewRating | FileRating;

    if (body.type === "review") {
        const review = await AppDataSource.getRepository(Review).findOne({
            where: {id: body.id}
        });

        if (!review) {
            res.status(404).json();
            return;
        }

        rating = new ReviewRating();
        rating.review = review;
        rating.is_positive = body.positive;
        rating.request_key = body.request_key;
        rating.ip_address = address;
    } else {
        const file = await AppDataSource.getRepository(CourseFile).findOne({
            where: {id: body.id}
        });

        if (!file) {
            res.status(404).json();
            return;
        }

        rating = new FileRating();
        rating.file = file;
        rating.is_positive = body.positive;
        rating.request_key = body.request_key;
        rating.ip_address = address;
    }

    await AppDataSource.getRepository(Rating).save(rating);

    res.status(200).json({result: "success"});
}

export const removeRating = async (req: Request, res: Response) => {
    const key = req.query.key as string;
    const type = req.query.type as "review" | "file";

    if (!key || !type) {
        res.status(400).json();
        return;
    }

    let rating = await AppDataSource.getRepository(Rating).findOne({
        where: {request_key: Equal(key)}
    });

    if (!rating) {
        res.status(404).json();
        return;
    }

    await AppDataSource.getRepository(Rating).remove(rating);

    res.status(200).json({result: "success"});
}