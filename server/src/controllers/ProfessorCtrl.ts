import {Request, Response} from 'express';
import {Professor} from "@spaceread/database/entity/professor/Professor";
import {Review} from "@spaceread/database/entity/professor/Review";
import requestIp from "request-ip";
import {createAssessment, validateProfessorComment} from "../utils";
import {ReviewAttachment} from "@spaceread/database/entity/professor/ReviewAttachment";
import {ReviewRating} from "@spaceread/database/entity/professor/ReviewRating";
import {RatingBody} from "../typed/professor";
import {AppDataSource, Azure} from "../app";
import {AzureClient} from "../azure";
import {Guest} from "@spaceread/database/entity/user/Guest";
import * as crypto from "crypto";

const sizeOf = require('image-size');


export const comment = async (req: Request, res: Response) => {
    const body = validateProfessorComment(req.body);

    const guestID: Guest = res.locals.user;

    let address = requestIp.getClientIp(req);

    if (!body || !guestID || !address) {
        res.status(400).json({
            success: false,
            message: "There was an error submitting your review. Contact us if the problem persists."
        });
        return;
    }

    if (address.includes(":")) {
        address = address.split(":").slice(-1).pop()!;
    }

    const valid = await createAssessment(body.recaptchaToken);

    const professorDB = await AppDataSource.getRepository(Professor).findOne({
        where: {email: body.professorEmail}
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

    review.comment = body.comment || "";
    review.score = body.score;
    review.positive = body.positive;
    review.professor = professorDB;
    review.author_ip = address;
    review.guest = guestID;
    review.visible = valid;

    await AppDataSource.getRepository(Review).save(review);

    const {author_ip, visible, reviewed, professor, guest, ..._} = review;

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

    const email = (params.email as string).toLowerCase();

    const professor = await AppDataSource.getRepository(Professor).findOne({
        where: {email: email},
        relations: ["reviews", "reviews.ratings", "reviews.guest", "reviews.ratings.guest"],
        order: {reviews: {created_at: "desc"}}
    });

    if (!professor || !professor.visible) {
        res.status(404).json({error: "Professor not found."});
        return;
    }

    const guestId: Guest = res.locals.user;

    const selfReview = guestId && professor.reviews.find(review => review.guest && (review.guest.token === guestId.token))?.id;

    const {visible, views, ...professorWithoutVisible} = professor;

    const filteredReviews = professor.reviews.filter(review => review.visible);

    const canReview = guestId && selfReview === undefined && !guestId.rated_professors.includes(professor.email);

    const newProfessor = {
        ...professorWithoutVisible,
        canReview: canReview,
        reviews: await Promise.all(
            filteredReviews
                .map(async ({guest, ratings, reviewed, author_ip, visible, attachments, ...review}) => {
                    const likesCount = ratings.filter(rating => rating.value).length;
                    const dislikesCount = ratings.filter(rating => !rating.value).length;

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

                    let selfRating = null;

                    if (guestId) {
                        const rating = ratings.find(rating => rating.guest?.token === guestId.token);
                        if (rating) {
                            selfRating = rating.value;
                        }
                    }

                    return {
                        ...review,
                        author: "User",
                        likes: likesCount,
                        dislikes: dislikesCount,
                        attachments: attachment,
                        self: review.id === selfReview,
                        selfRating: selfRating
                    };
                })),
        score: filteredReviews.reduce((sum, review) => sum + review.score, 0) / Math.max(filteredReviews.length, 1)
    };

    newProfessor.reviews.sort((a, b) => {
        const aDate = new Date(a.created_at).getTime();
        const bDate = new Date(b.created_at).getTime();
        const aLikes = a.likes - a.dislikes;
        const bLikes = b.likes - b.dislikes;

        const oneWeek = 7 * 24 * 60 * 60 * 1000; // milliseconds in one week
        const sixMonths = 6 * 30 * 24 * 60 * 60 * 1000; // milliseconds in six months
        const now = Date.now();

        // Check if a review is less than a week old
        const aNew = now - aDate < oneWeek;
        const bNew = now - bDate < oneWeek;

        // Check if a review is older than 6 months
        const aOld = now - aDate > sixMonths;
        const bOld = now - bDate > sixMonths;

        // If both reviews are less than a week old, sort by date
        if (aNew && bNew) {
            return bDate - aDate;
        }

        // If one review is new and the other is not, the new one comes first
        if (aNew !== bNew) {
            return aNew ? -1 : 1;
        }

        // If one review is old and the other is not, the old one goes to the bottom
        if (aOld !== bOld) {
            return aOld ? 1 : -1;
        }

        // If both reviews are not new and not old, sort by score of 1 and 5
        if (a.score === 1 || a.score === 5) {
            if (b.score === 1 || b.score === 5) {
                // If both have score of 1 or 5, sort by likes/dislikes ratio
                if (aLikes !== bLikes) {
                    return bLikes - aLikes;
                } else {
                    // If likes/dislikes ratio is the same, sort by date
                    return bDate - aDate;
                }
            } else {
                // If only a has score of 1 or 5, a comes first
                return -1;
            }
        } else if (b.score === 1 || b.score === 5) {
            // If only b has score of 1 or 5, b comes first
            return 1;
        } else {
            // If neither has score of 1 or 5, sort by likes/dislikes ratio
            if (aLikes !== bLikes) {
                return bLikes - aLikes;
            } else {
                // If likes/dislikes ratio is the same, sort by date
                return bDate - aDate;
            }
        }
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

    const guest: Guest = res.locals.user;

    let address = requestIp.getClientIp(req);

    if (!body.reviewId || body.positive === null || !guest || !address) {
        res.status(400).json();
        return;
    }

    if (address.includes(":")) {
        address = address.split(":").slice(-1).pop()!;
    }

    let rating: ReviewRating;

    const review = await AppDataSource.getRepository(Review).findOne({
        where: {id: body.reviewId}
    });

    const existingRating = await AppDataSource.getRepository(ReviewRating).findOne({
        where: {guest: {token: guest.token}, review: {id: body.reviewId}}
    });

    if (!review || existingRating) {
        res.status(404).json();
        return;
    }

    rating = new ReviewRating();

    rating.guest = guest;
    rating.review = review;
    rating.value = body.positive;
    rating.ip_address = address;
    rating.id = crypto.randomUUID();

    await AppDataSource.getRepository(ReviewRating).save(rating);

    res.status(200).json({result: "success"});
}

export const removeRating = async (req: Request, res: Response) => {
    const reviewId = parseInt(<string>req.query.reviewId);

    const guest: Guest = res.locals.user;

    if (!guest || !reviewId) {
        res.status(400).json();
        return;
    }

    let rating = await AppDataSource.getRepository(ReviewRating).findOne({
        where: {review: {id: reviewId}, guest: {token: guest.token}}
    });

    if (!rating) {
        res.status(404).json();
        return;
    }

    await AppDataSource.getRepository(ReviewRating).remove(rating);

    res.status(200).json({result: "success"});
}