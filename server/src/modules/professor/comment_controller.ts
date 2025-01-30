import {Request, Response} from "express";
import {Guest} from "@spaceread/database/entity/user/Guest";
import {CommentBody, RatingBody} from "../../typed/professor";
import {Google, ProfessorService} from "../../app";
import {getClientIp, omit} from "../../utils/utils";

export const comment = async (req: Request, res: Response) => {
    const body = req.body as CommentBody;

    const guest: Guest = res.locals.user;

    const address = getClientIp(req);

    if (!guest || !address) {
        res.status(400).json({error: "There was an error submitting your review. Contact us if the problem persists."});
        return;
    }

    const validCaptcha = await Google.createAssessment(body.recaptchaToken);

    if (!validCaptcha) {
        res.status(400).json({error: "There was an error submitting your review. Contact us if the problem persists."});
        return;
    }

    const professor = await ProfessorService.getProfessor(body.professorEmail);

    if (!professor) {
        res.status(400).json({error: "Invalid."});
        return;
    }

    const existingReview = professor.reviews.find(
        review => review.actor?.token === res.locals.user.token && !review.soft_delete
    );

    if (existingReview) {
        res.status(400).json({error: "You have already submitted a review."});
    }

    console.log({
        attachments: body.attachments,
        ipAddress: address,
        comment: body.comment || "",
        positive: body.positive,
        score: body.score,
        guest,
        professor
    })

    const review = await ProfessorService.postReview({
        attachments: body.attachments,
        ipAddress: address,
        comment: body.comment || "",
        positive: body.positive,
        score: body.score,
        guest,
        professor
    });

    const filteredReview = omit(review, ["author_ip", "visible", "reviewed", "professor", "actor"]);

    res.status(201).json({success: true, review: filteredReview});
}


export const deleteComment = async (req: Request, res: Response) => {
    const reviewId = parseInt(req.query.id as string);
    const guest: Guest = res.locals.user;

    if (!reviewId) {
        res.status(400).json({error: "Invalid review ID."});
        return;
    }

    try {
        await ProfessorService.deleteReview(reviewId, guest.token);
    } catch (e) {
        res.status(404).json({error: "There was an error deleting the review."});
    }

    res.status(200).json({ success: true });
}

export const uploadImage = async (req: Request, res: Response) => {
    const file = req.file;

    const address = getClientIp(req);

    if (!file || !address) {
        res.status(400).json();
        return;
    }

    try {
        const blobName = await ProfessorService.uploadImageToAzure(file, address);
        res.status(200).json({ success: true, id: blobName });
    } catch (e) {
        console.error(e);
        res.status(500).json({result: "error", error: "There was an error uploading the image."});
        return;
    }
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

    try {
        await ProfessorService.uploadTenorToAzure(body.url, body.width, body.height);
        res.status(200).json({ success: true, id: body.url });
    } catch (e) {
        console.error(e);
        res.status(404).json({result: "error", error: "There was an error uploading the image."});
    }

}

export const addRating = async (req: Request, res: Response) => {
    const body = req.body as RatingBody;

    const guest: Guest = res.locals.user;

    let address = getClientIp(req);

    if (body.reviewId == null || body.positive == null || !guest || !address) {
        res.status(400).json();
        return;
    }

    const review = await ProfessorService.getReview(body.reviewId);

    const existingRating = await ProfessorService.getRating(guest.token, body.reviewId);

    if (!review || existingRating) {
        res.status(404).json({result: "error", error: "There was an error adding the rating."});
        return;
    }

    try {
        await ProfessorService.addRating(guest, review, address, body.positive);
        res.status(200).json({result: "success"});
    } catch (e) {
        console.error(e);
        res.status(500).json({result: "error", error: "There was an error adding the rating."});
        return;
    }

}

export const removeRating = async (req: Request, res: Response) => {
    const reviewId = parseInt(<string>req.query.reviewId);

    const guest: Guest = res.locals.user;

    if (!guest || !reviewId) {
        res.status(400).json();
        return;
    }

    const rating = await ProfessorService.getRating(guest.token, reviewId);

    if (!rating) {
        res.status(404).json({result: "error", error: "There was an error removing the rating."});
        return;
    }

    try {
        await ProfessorService.deleteRating(rating);
        res.status(200).json({result: "success"});
    } catch (e) {
        console.error(e);
        res.status(500).json({result: "error", error: "There was an error removing the rating."});
        return;
    }

}