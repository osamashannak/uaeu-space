import {Request, Response} from 'express';
import requestIp from "request-ip";
import {createAssessment, validateProfessorComment} from "../utils";
import crypto from "crypto";
import sizeOf from 'image-size';
import {AppDataSource, Azure} from "../app";
import {AzureClient} from "../azure";
import {Professor} from "@spaceread/database/entity/professor/Professor";
import {ReviewAttachment} from "@spaceread/database/entity/professor/ReviewAttachment";
import {Review} from "@spaceread/database/entity/professor/Review";
import {RatingType} from "@spaceread/database/entity/professor/ReviewRating";


export const comment = async (req: Request, res: Response) => {
    const body = validateProfessorComment(req.body);
   // let address = requestIp.getClientIp(req);

    let address = '192.168.1.1';

    if (!body) {
        res.status(400).json({error: "Invalid."});
        return;
    }

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
        where: {email: body.professorEmail}
    });

    if (!professor) {
        res.status(200).json({success: "failed-nop"});
        return;
    }

    const review = new Review();

    if (body.attachments.length > 0) {
        const attachmentId = body.attachments[0];
        const attachment = await AppDataSource.getRepository(ReviewAttachment).findOne({
            where: {id: attachmentId}
        });
        if (attachment) {
            review.attachment = attachment.id;
        }
    }

    review.author = "Anonymous";
    review.comment = body.comment;
    review.score = parseInt(body.score);
    review.positive = body.positive;
    review.professor = professor;
    review.author_ip = address;
    review.visible = valid;

    await AppDataSource.getRepository(Review).save(review);

    res.status(201).json({result: "success"});
}

export const upload = async (req: Request, res: Response) => {
    const file = req.file;
    // let address = requestIp.getClientIp(req);

    let address = '192.168.1.1';

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
    reviewAttachment.height = dimensions.height!;
    reviewAttachment.width = dimensions.width!;
    reviewAttachment.ip_address = address;

    await AppDataSource.getRepository(ReviewAttachment).save(reviewAttachment);

    const nsfwResult = await Azure.analyzeImage(AzureClient.getFileURL(blobName, "attachments"));

    console.log(nsfwResult);
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
        where: {email: (params.email as string).toLowerCase()},
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
                    const likesCount = ratings.filter(rating => rating.type === RatingType.LIKE).length;
                    const dislikesCount = ratings.filter(rating => rating.type === RatingType.DISLIKE).length;

                    let newAttachment = null;

                    if (attachment) {
                        const reviewAttachment = await AppDataSource.getRepository(ReviewAttachment).findOne({
                            where: {id: attachment}
                        });
                        if (reviewAttachment && reviewAttachment.visible) {
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