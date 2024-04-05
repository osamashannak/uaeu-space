import {Request, Response} from 'express';
import jwt, {JwtPayload} from "jsonwebtoken";
import {OAuth2Client} from "google-auth-library";
import {JWT_SECRET} from "../app";
import {AppDataSource} from "../orm/data-source";
import {Review} from "../orm/entity/Review";
import {ALLOWED_EMAILS, verifyJWTToken} from "../utils";
import {CourseFile} from "../orm/entity/CourseFile";
import {Professor} from "../orm/entity/Professor";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


export const authenticate = async (req: Request, res: Response) => {
    const token = req.body.token;

    if (!token) {
        res.status(400).send("Invalid");
        return;
    }

    let ticket;

    try {
        ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        });
    } catch (error) {
        res.status(400).send("Invalid");
        return;
    }

    const payload = ticket.getPayload();

    if (payload === undefined || !ALLOWED_EMAILS.includes(payload.email)) {
        res.status(405).send("Invalid");
        return;
    }

    const jwtToken = jwt.sign(<JwtPayload>{
        email: payload.email,
        name: payload.name,
    }, JWT_SECRET, {expiresIn: "1d"});

    res.status(200).json({
        name: payload.name,
        token: jwtToken
    });
}

export const verifyToken = async (req: Request, res: Response) => {
    const token = req.body.token;

    if (!token) {
        res.status(401).send("Invalid");
        return;
    }

    const decoded = verifyJWTToken(token);

    if (!decoded) {
        res.status(401).send("Invalid");
        return;
    }

    res.status(200).json({name: decoded.name});
}

export const getPendingReviews = async (req: Request, res: Response) => {
    const token = req.headers.authorization;

    if (!token) {
        res.status(401).send("Invalid");
        return;
    }

    const validateToken = verifyJWTToken(token);

    if (!validateToken) {
        res.status(401).send("Invalid");
        return;
    }

    const professorEmail = req.query.email as string;

    let pendingReviews;

    if (professorEmail) {
        const professor = await AppDataSource.getRepository(Professor).findOne({where: {email: professorEmail}});

        if (professor) {
            pendingReviews = await AppDataSource.getRepository(Review).find({
                where: {professor: professor},
                relations: ["professor", "ratings"],
                order: {created_at: "desc"},
            });
        }

    } else {
        pendingReviews = await AppDataSource.getRepository(Review).find({
            where: {reviewed: false},
            relations: ["professor", "ratings"],
            order: {created_at: "desc"},
            take: 20
        });
    }

    if (!pendingReviews) {
        res.status(404).send("Not found");
        return;
    }

    const reviews = pendingReviews.map(({ratings, ...review}) => {
        const likesCount = ratings.filter(rating => rating.is_positive).length;
        const dislikesCount = ratings.filter(rating => !rating.is_positive).length;

        return {
            ...review,
            likes: likesCount,
            dislikes: dislikesCount
        };
    })


    res.status(200).json(reviews);

}

export const getPendingFiles = async (req: Request, res: Response) => {
    const token = req.headers.authorization;

    if (!token) {
        res.status(401).send("Invalid");
        return;
    }

    const validateToken = verifyJWTToken(token);

    if (!validateToken) {
        res.status(401).send("Invalid");
        return;
    }

    const pendingFiles = await AppDataSource.getRepository(CourseFile).find({
        where: {reviewed: false, visible: false},
        relations: ["course", "ratings"],
        order: {created_at: "desc"}
    });

    const files = pendingFiles.map(({ratings, visible, ...review}) => {
        const likesCount = ratings.filter(rating => rating.is_positive).length;
        const dislikesCount = ratings.filter(rating => !rating.is_positive).length;

        return {
            ...review,
            likes: likesCount,
            dislikes: dislikesCount
        };
    });

    res.status(200).json(files);
}

export const reviewAction = async (req: Request, res: Response) => {

    const token = req.headers.authorization;
    const reviewId = req.body.reviewId;
    const action = req.body.action;

    if (!token || !reviewId || !action) {
        res.status(400).send("Invalid");
        return;
    }

    const validateToken = verifyJWTToken(token);

    if (!validateToken) {
        res.status(401).send("Invalid");
        return;
    }

    const review = await AppDataSource.getRepository(Review).findOne({
        where: {id: reviewId},
    });

    if (!review) {
        res.status(404).send("Invalid");
        return;
    }

    review.reviewed = true;

    if (action === "hide") {
        review.visible = false;
    } else {
        review.visible = true;
    }

    await AppDataSource.getRepository(Review).save(review);

    res.status(200).json({success: true});
}