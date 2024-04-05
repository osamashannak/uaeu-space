import {Request, Response} from 'express';
import {AppDataSource} from "../orm/data-source";
import {Professor} from "../orm/entity/Professor";
import {Equal, ILike} from "typeorm";
import {Review} from "../orm/entity/Review";
import requestIp from "request-ip";
import {createAssessment, validateProfessorComment} from "../utils";
import {ReviewAttachment} from "../orm/entity/ReviewAttachment";
import crypto from "crypto";
import {FileRating, Rating, ReviewRating} from "../orm/entity/Rating";
import {CourseFile} from "../orm/entity/CourseFile";
import {RatingBody} from "../typed/professor";
import {Azure} from "../app";
import {AzureClient} from "../azure";
import exp from "node:constants";

const sizeOf = require('image-size');


export const comment = async (req: Request, res: Response) => {
    const body = validateProfessorComment(req.body);
    let address = requestIp.getClientIp(req);

    if (!body) {
        res.status(400).json({
            success: false,
            message: "There was an error submitting your review. Contact us if the problem persists."
        });
        return;
    }

    const valid = await createAssessment(body.recaptchaToken);

    if (!address) {
        res.status(400).json({
            success: false,
            message: "There was an error submitting your review. Contact us if the problem persists."
        });
        return;
    }

    if (address.includes(":")) {
        address = address.split(":").slice(-1).pop()!;
    }

    const professorDB = await AppDataSource.getRepository(Professor).findOne({
        where: {email: Equal(body.professorEmail)}
    });

    if (!professorDB) {
        res.status(400).json({
            success: false,
            message: "There was an error submitting your review. Contact us if the problem persists."
        });
        return;
    }

    const review = new Review();

    if (body.attachments && body.attachments.length > 0) {
        review.attachments = [];
        for (const attachment of body.attachments) {
            const reviewAttachment = await AppDataSource.getRepository(ReviewAttachment).findOne({
                where: {id: attachment}
            });

            if (reviewAttachment && reviewAttachment.visible) {
                review.attachments.push(attachment);
            }
        }
    }

    review.author = "Anonymous";
    review.comment = body.comment || "";
    review.score = body.score;
    review.positive = body.positive;
    review.professor = professorDB;
    review.author_ip = address;
    review.visible = valid;

    await AppDataSource.getRepository(Review).save(review);

    const {author_ip, visible, reviewed, professor, ..._} = review;

    res.status(201).json({success: true, review: _});
}

export const uploadImage = async (req: Request, res: Response) => {
    const file = req.file;
    let address = requestIp.getClientIp(req);

    if (!file) {
        res.status(400).json({error: "Invalid."});
        return;
    }

    if (!address) {
        res.status(400).json({error: "Invalid."});
        return;
    }

    if (address.includes(":")) {
        address = address.split(":").slice(-1).pop()!;
    }

    const dimensions = sizeOf(file.buffer);

    const blobName = crypto.randomUUID();

    res.status(200).json({result: "success", id: blobName});

    await Azure.uploadAttachment(blobName, file.buffer, file.mimetype);

    const reviewAttachment = new ReviewAttachment();

    reviewAttachment.id = blobName;
    reviewAttachment.mime_type = file.mimetype;
    reviewAttachment.size = file.size;
    reviewAttachment.height = dimensions.height;
    reviewAttachment.width = dimensions.width;
    reviewAttachment.ip_address = address;

    await AppDataSource.getRepository(ReviewAttachment).save(reviewAttachment);

    reviewAttachment.visible = await Azure.analyzeImage(AzureClient.getFileURL(blobName, "attachments"));

    await AppDataSource.getRepository(ReviewAttachment).save(reviewAttachment);
}

export const uploadTenor = async (req: Request, res: Response) => {
    const body = req.body as {
        url: string;
        height: number;
        width: number;
    };

    console.log(body)

    if (!body.url || !body.url.startsWith("https://media.tenor.com/") || !body.height || !body.width) {
        res.status(400).json({error: "Invalid."});
        return;
    }

    res.status(200).json({result: "success", id: body.url});

    const existing = await AppDataSource.getRepository(ReviewAttachment).findOne({
        where: {id: body.url}
    });

    if (existing) {
        return;
    }

    const reviewAttachment = new ReviewAttachment();

    reviewAttachment.mime_type = "image/gif";
    reviewAttachment.id = body.url;
    reviewAttachment.height = body.height;
    reviewAttachment.width = body.width;
    reviewAttachment.visible = true;

    await AppDataSource.getRepository(ReviewAttachment).save(reviewAttachment);

}

export const find = async (req: Request, res: Response) => {

    const params = req.query;

    if (!params.email) {
        res.status(400).json({"request": "failed"});
        return;
    }

    const professor = await AppDataSource.getRepository(Professor).findOne({
        where: {email: ILike(params.email as string)},
        relations: ["reviews", "reviews.ratings"],
        order: {reviews: {created_at: "desc"}},

    });

    if (!professor || !professor.visible) {
        res.status(404).json({error: "Professor not found."});
        return;
    }

    const {visible, views, ...professorWithoutVisible} = professor;

    const filteredReviews = professor.reviews.filter(review => review.visible);

    const newProfessor = {
        ...professorWithoutVisible,
        reviews: await Promise.all(
            filteredReviews
                .map(async ({ratings, reviewed, author_ip, visible, attachments, ...review}) => {
                    const likesCount = ratings.filter(rating => rating.is_positive).length;
                    const dislikesCount = ratings.filter(rating => !rating.is_positive).length;

                    let attachment = null;

                    if (attachments && attachments.length > 0) {
                        attachment = await Promise.all(
                            attachments.map(async attachment => {

                                const reviewAttachment = await AppDataSource.getRepository(ReviewAttachment).findOne({
                                    where: {id: attachment}
                                });

                                if (reviewAttachment && reviewAttachment.visible) {
                                    if (reviewAttachment.id.includes("tenor")) {
                                        return {
                                            id: attachment,
                                            height: reviewAttachment.height,
                                            width: reviewAttachment.width,
                                            url: reviewAttachment.id,
                                        };
                                    }

                                    return {
                                        id: attachment,
                                        height: reviewAttachment.height,
                                        width: reviewAttachment.width,
                                        url: AzureClient.getFileURL(attachment, "attachments"),
                                    };
                                }
                            })
                        );
                    }

                    return {
                        ...review,
                        likes: likesCount,
                        dislikes: dislikesCount,
                        attachments: attachment
                    };
                })),
        score: filteredReviews.reduce((sum, review) => sum + review.score, 0) / Math.max(filteredReviews.length, 1)
    };

    newProfessor.reviews.sort((a, b) => {
        const aDate = new Date(a.created_at).getTime();
        const bDate = new Date(b.created_at).getTime();
        const aLikes = a.likes - a.dislikes;
        const bLikes = b.likes - b.dislikes;

        if (aDate > Date.now() - 86400000 && bDate > Date.now() - 86400000) {
            return bDate - aDate;
        }
        if (aDate > Date.now() - 86400000) {
            return -1;
        }
        if (bDate > Date.now() - 86400000) {
            return 1;
        }
        if (aLikes !== bLikes) {
            return bLikes - aLikes;
        }
        return bDate - aDate;
    });

    res.status(200).json({success: true, professor: newProfessor});
}

export const getAll = async (req: Request, res: Response) => {
    const professors = await AppDataSource.getRepository(Professor).find({
        where: {visible: true},
        select: {name: true, email: true},
        order: {views: "desc"}
    });

    res.status(200).json({professors: professors});
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