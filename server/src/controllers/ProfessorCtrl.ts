import {Request, Response} from 'express';
import {AppDataSource} from "../orm/data-source";
import {Professor} from "../orm/entity/Professor";
import {Equal, ILike} from "typeorm";
import {Review} from "../orm/entity/Review";
import requestIp from "request-ip";
import {createAssessment} from "../utils";


type RateBody = {
    review: {
        author: string,
        positive: boolean,
        comment: string,
        score: number
    },
    professor: string,
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
    review.author_ip = address;
    review.visible = valid;

    await AppDataSource.getRepository(Review).save(review);

    res.status(200).json({result: "success"});
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
        reviews: filteredReviews
            .map(({ratings, reviewed, author_ip, visible, ...review}) => {
                const likesCount = ratings.filter(rating => rating.is_positive).length;
                const dislikesCount = ratings.filter(rating => !rating.is_positive).length;

                return {
                    ...review,
                    likes: likesCount,
                    dislikes: dislikesCount
                };
            }),
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