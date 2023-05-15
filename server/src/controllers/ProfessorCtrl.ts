import {Request, Response} from 'express';
import {AppDataSource} from "../orm/data-source";
import {Professor} from "../orm/entity/Professor";
import {Equal, ILike} from "typeorm";
import {Review} from "../orm/entity/Review";
import {ReviewRatings} from "../orm/entity/ReviewRatings";
import {Course} from "../orm/entity/Course";


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

export const rate = async (req: Request, res: Response) => {
    const body: RateBody = req.body;

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

    await AppDataSource.getRepository(Review).save(review);

    res.status(200).json({result: "success"});
}

export const getRating = async (req: Request, res: Response) => {

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

export const rateReview = async (req: Request, res: Response) => {
    const body = req.body;
    console.log(body)

    if (!body.reviewId || body.positive === null || !body.request_key) {
        res.status(400).json();
        return;
    }

    const review = await AppDataSource.getRepository(Review).findOne({
        where: {id: Equal(body.reviewId)}
    });

    if (!review) {
        res.status(200).json({error: "Review not found."});
        return;
    }

    const reviewRating = new ReviewRatings();

    reviewRating.request_key = body.request_key;
    reviewRating.is_positive = body.positive;
    reviewRating.review = review;

    await AppDataSource.getRepository(ReviewRatings).save(reviewRating);

    res.status(200).json({result: "success"});
}

export const removeReviewRating = async (req: Request, res: Response) => {
    const body = req.body;


    if (!body.request_key) {
        res.status(400).json();
        return;
    }

    const reviewRating = await AppDataSource.getRepository(ReviewRatings).findOne({
        where: {request_key: Equal(body.request_key)}
    });

    if (!reviewRating) {
        console.log(body)
        res.status(200).json({error: "Review rating not found."});
        return;
    }

    await AppDataSource.getRepository(ReviewRatings).remove(reviewRating);

    res.status(200).json({result: "success"});
}

export const getReviewRatings = async (req: Request, res: Response) => {
    const params = req.query;

    if (!params.reviewId) {
        res.status(400).json();
        return;
    }

    const review = await AppDataSource.getRepository(Review).findOne({
        where: {id: Equal(parseInt(<string>params.reviewId))},
        relations: ["ratings"]
    });

    if (!review) {
        res.status(200).json({error: "Review not found."});
        return;
    }

    let likes = 0;
    let dislikes = 0;

    review.ratings.forEach(value => {
        value.is_positive ? likes += 1 : dislikes += 1;
    });

    res.status(200).json({likes: likes, dislikes: dislikes});
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

    const newProfessor = {
        ...professorWithoutVisible,
        reviews: professor.reviews
            .filter(review => review.visible)
            .map(({ratings, visible, ...review}) => {
                const likesCount = ratings.filter(rating => rating.is_positive).length;
                const dislikesCount = ratings.filter(rating => !rating.is_positive).length;

                return {
                    ...review,
                    likes: likesCount,
                    dislikes: dislikesCount
                };
            }),
        score: professor.reviews.reduce((sum, review) => sum + review.score, 0) / Math.max(professor.reviews.length, 1)
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