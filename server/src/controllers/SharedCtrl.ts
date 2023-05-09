import {Request, Response} from "express";
import {AppDataSource} from "../orm/data-source";
import {CourseFile} from "../orm/entity/course/CourseFile";
import {Equal} from "typeorm";
import {Review} from "../orm/entity/professor/Review";
import {FileRating, Rating, ReviewRating} from "../orm/entity/Rating";
import Client from "../orm/entity/Client";

interface AddRatingBody {
    id: number,
    positive: boolean,
    type: RatingType
}

interface RemoveRatingBody {
    id: number,
    type: RatingType
}

export enum RatingType {
    Review = "review",
    File = "file"
}

export const addRating = async (req: Request, res: Response) => {
    const body = req.body as AddRatingBody;
    const headers = req.headers;

    if (!body.id || body.positive === null || !body.type || !headers['client-key']) {
        console.log("1111")
        res.status(400).json();
        return;
    }

    const client = await AppDataSource.getRepository(Client).findOne({
        where: {client_key: Equal(headers['client-key'] as string)},
        relations: ["ratings", "ratings.review"]
    });
    console.log("2222")

    if (!client) {
        console.log("3333")
        res.status(400).json({error: "Invalid client key."});
        return;
    }

    await removeExistingRating(client, body.id);

    let object;

    if (body.type === RatingType.File) {
        object = await AppDataSource.getRepository(CourseFile).findOne({
            where: {id: Equal(body.id)},
            relations: ["ratings"]
        });
    } else if (body.type === RatingType.Review) {
        object = await AppDataSource.getRepository(Review).findOne({
            where: {id: Equal(body.id)},
            relations: ["ratings"]
        });
    } else {
        res.status(400).json();
        return;
    }

    if (!object) {
        res.status(200).json({error: "Object not found."});
        return;
    }

    let rating;

    if (object instanceof CourseFile) {
        rating = new FileRating();
        rating.file = object;
    } else {
        rating = new ReviewRating();
        rating.review = object;
    }

    rating.is_positive = body.positive;
    rating.client = client;

    await AppDataSource.getRepository(Rating).save(rating);

    res.status(200).json({result: "success"});
}

export const removeRating = async (req: Request, res: Response) => {
    const body = req.body as RemoveRatingBody;
    const headers = req.headers;

    if (!body.id || !body.type || !headers['client-key']) {
        res.status(400).json();
        return;
    }

    const client = await AppDataSource.getRepository(Client).findOne({
        where: {client_key: Equal(headers['client-key'] as string)},
        relations: ["ratings"]
    });

    if (!client) {
        res.status(400).json({error: "Invalid client key."});
        return;
    }

    await removeExistingRating(client, body.id);

    res.status(200).json({result: "success"});
}

const removeExistingRating = async (client: Client, id: number) => {
    let ratingCheck;

    for (let rating of client.ratings) {
        console.log(rating)
        if (rating instanceof FileRating && rating.file.id === id) {
            ratingCheck = rating;
            break;
        } else if (rating instanceof ReviewRating && rating.review.id === id) {
            ratingCheck = rating;
            break;
        }
    }

    if (ratingCheck) {
        await AppDataSource.getRepository(Rating).remove(ratingCheck);
    }
}