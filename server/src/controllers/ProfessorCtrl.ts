import {Request, Response} from 'express';
import {createAssessment, validateProfessorComment} from "../utils";
import {AppDataSource, Azure} from "../app";
import {Professor} from "@spaceread/database/entity/professor/Professor";
import {ReviewAttachment} from "@spaceread/database/entity/professor/ReviewAttachment";
import {Review} from "@spaceread/database/entity/professor/Review";
import {RatingType} from "@spaceread/database/entity/professor/ReviewRating";
import ffmpeg from "fluent-ffmpeg";
import {promisify} from "util";
import {AzureClient} from "../azure";
import sizeOf from "image-size";
import * as fs from "fs";
import {Guest} from "@spaceread/database/entity/user/Guest";
import {User} from "@spaceread/database/entity/user/User";

export const comment = async (req: Request, res: Response) => {
    const body = validateProfessorComment(req.body);
   // let address = requestIp.getClientIp(req);

    let address = '192.168.1.1';

    if (!body) {
        res.status(400).json({
            success: false,
            message: "There was an error submitting your review. Contact us if the problem persists."
        });
        return;
    }

    //const valid = await createAssessment(body.recaptchaToken);
    const valid = true;

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

    const professor = await AppDataSource.getRepository(Professor).findOne({
        where: {email: body.professorEmail}
    });

    if (!professor) {
        res.status(400).json({
            success: false,
            message: "There was an error submitting your review. Contact us if the problem persists."
        });
        return;
    }

    const review = new Review();

    if (body.attachments.length > 0) {
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

    const user: Guest | User = res.locals.user;

    review.author = "Anonymous";
    review.comment = body.comment;
    review.score = parseInt(body.score);
    review.positive = body.positive;
    review.professor = professor;
    review.author_ip = address;
    review.visible = valid;

    if (user instanceof Guest) {
        review.guest = user;
    } else {
        review.user = user;
    }

    await AppDataSource.getRepository(Review).save(review);

    res.status(201).json({result: "success"});
}

const ffprobeAsync = promisify(ffmpeg.ffprobe);
const unlinkAsync = promisify(fs.unlink)

export const uploadVideo = async (req: Request, res: Response) => {
    // let address = requestIp.getClientIp(req);
    let address = '192.168.1.1';

    if (!address) {
        res.status(400).json({error: "Invalid."});
        return;
    }

    const file = req.file;
    console.log(file);

    if (!file) {
        res.status(400).json({error: "Invalid."});
        return;
    }

    let filePath = file.path;

    const metadata = await ffprobeAsync(filePath) as ffmpeg.FfprobeData;

    if (metadata.format.duration! >= 180) {
        res.status(400).json({error: "The video must be at most 3 minutes long."});
        return;
    }

    const frameRate = metadata.streams[0].avg_frame_rate!.split("/");


    if (parseInt(frameRate[0]) / parseInt(frameRate[1]) > 60) {
        res.status(400).json({error: "The video frame rate must be less than 60fps."});
        return;
    }

    res.status(200).json({result: "success", id: file.filename});

    await Azure.uploadVideoAttachment(file.filename, filePath, file.mimetype);

    await unlinkAsync(filePath);

    const reviewAttachment = new ReviewAttachment();

    reviewAttachment.id = file.filename;
    reviewAttachment.mime_type = file.mimetype;
    reviewAttachment.size = file.size;
    reviewAttachment.height = metadata.streams[0].height!;
    reviewAttachment.width = metadata.streams[0].width!;
    reviewAttachment.ip_address = address;

    await AppDataSource.getRepository(ReviewAttachment).save(reviewAttachment);

}

export const upload = async (req: Request, res: Response) => {
    // let address = requestIp.getClientIp(req);
    let address = '192.168.1.1';

    const file = req.file;


    if (!address) {
        res.status(400).json({error: "Invalid."});
        return;
    }

    if (!file) {
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
                .map(async ({ratings, reviewed, author_ip, visible, attachments, ...review}) => {
                    const likesCount = ratings.filter(rating => rating.type === RatingType.LIKE).length;
                    const dislikesCount = ratings.filter(rating => rating.type === RatingType.DISLIKE).length;

                    let newAttachment = null;

                    if (attachments && attachments.length > 0) {
                        newAttachment = await Promise.all(
                            attachments.map(async attachment => {
                                const reviewAttachment = await AppDataSource.getRepository(ReviewAttachment).findOne({
                                    where: {id: attachment}
                                });

                                if (reviewAttachment && reviewAttachment.visible) {
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
                        attachments: newAttachment
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