import {Request, Response} from 'express';
import {AppDataSource} from "../orm/data-source";
import {Professor} from "../orm/entity/Professor";
import {Equal, ILike} from "typeorm";
import {Review} from "../orm/entity/Review";
import requestIp from "request-ip";
import {createAssessment} from "../utils";
import {getFileURL, uploadAttachment} from "../azure";
import {ReviewAttachment} from "../orm/entity/ReviewAttachment";
import {analyzeImage} from "../azure-vision";

const sizeOf = require('image-size');

type RateBody = {
    positive: boolean,
    comment: string,
    score: number,
    attachments: string[],
    professorEmail: string,
    recaptchaToken: string
}

export const rate = async (req: Request, res: Response) => {
    const body: RateBody = req.body;
    let address = requestIp.getClientIp(req);

    let valid: boolean = true;

    if (body.recaptchaToken) {
        const checkValidity = await createAssessment(body.recaptchaToken);
        if (!checkValidity) {
            valid = checkValidity;
        }
    }

    if (!address) {
        res.status(400).json({error: "Invalid."});
        return;
    }

    if (address.includes(":")) {
        address = address.split(":").slice(-1).pop()!;
    }

    const professor = await AppDataSource.getRepository(Professor).findOne({
        where: {email: Equal(body.professorEmail)}
    });

    if (!professor || body.comment == undefined || !body.score || body.positive == undefined) {
        res.status(200).json({success: "failed-nop"});
        return;
    }

    const review = new Review();

    if (body.attachments.length > 0) {
        const attachmentId = body.attachments[0];
        const attachment = await AppDataSource.getRepository(ReviewAttachment).findOne({
            where: {id: Equal(attachmentId)}
        });
        if (attachment) {
            review.attachment = attachment.id;
        }
    }

    review.author = "Anonymous";
    review.comment = body.comment;
    review.score = body.score;
    review.positive = body.positive;
    review.professor = professor;
    review.author_ip = address;
    review.visible = valid;

    await AppDataSource.getRepository(Review).save(review);

    res.status(200).json({result: "success"});
}

export const upload = async (req: Request, res: Response) => {
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

    const blobName = await uploadAttachment(file.buffer, file.mimetype);

    res.status(200).json({result: "success", id: blobName});

    const nsfwResult = await analyzeImage(getFileURL(blobName, "attachments"));

    console.log(nsfwResult);

    const reviewAttachment = new ReviewAttachment();

    reviewAttachment.id = blobName;
    reviewAttachment.mime_type = file.mimetype;
    reviewAttachment.size = file.size;
    reviewAttachment.height = dimensions.height;
    reviewAttachment.width = dimensions.width;
    reviewAttachment.ip_address = address;
    reviewAttachment.visible = nsfwResult;

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
                .map(async ({ratings, reviewed, author_ip, visible, attachment, ...review}) => {
                    const likesCount = ratings.filter(rating => rating.is_positive).length;
                    const dislikesCount = ratings.filter(rating => !rating.is_positive).length;

                    let newAttachment = null;

                    if (attachment) {
                        const reviewAttachment = await AppDataSource.getRepository(ReviewAttachment).findOne({
                            where: {id: Equal(attachment)}
                        });
                        if (reviewAttachment) {
                            newAttachment = {
                                id: reviewAttachment.id,
                                width: reviewAttachment.width,
                                height: reviewAttachment.height,
                            };
                        }
                    }

                    return {
                        ...review,
                        likes: likesCount,
                        dislikes: dislikesCount,
                        attachment: newAttachment
                    };
                })),
        score: filteredReviews.reduce((sum, review) => sum + review.score, 0) / Math.max(filteredReviews.length, 1)
    };

    if (params.viewed && params.viewed === "false") {
        const userRepo = AppDataSource.getRepository(Professor);
        professor.views += 1;
        await userRepo.save(professor);
    }

    res.status(200).json({professor: newProfessor});
}

export const getAll = async (req: Request, res: Response) => {
    const professors = await AppDataSource.getRepository(Professor).find({
        where: {visible: true},
        select: {name: true, email: true},
        order: {views: "desc"}
    });

    res.status(200).json({professors: professors});
}