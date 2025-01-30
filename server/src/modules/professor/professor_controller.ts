import {Request, Response} from 'express';
import {Guest} from "@spaceread/database/entity/user/Guest";
import {calculateAverageScore, formatReviews, sortReviews} from "../../utils/professor";
import {ProfessorService} from "../../app";


const cache = new Map<string, any[]>();

export const find = async (req: Request, res: Response) => {
    const { email } = req.query as { email?: string };

    if (!email) {
        res.status(404).json({error: "Professor not found."});
        return;
    }

    const professor = await ProfessorService.getProfessor(email);

    if (!professor) {
        res.status(404).json({error: "Professor not found."});
        return;
    }

    const guest: Guest = res.locals.user;
    const guestToken = guest.token;
    const selfReviewId = professor.reviews.find(
        review => review.actor?.token === guestToken && !review.soft_delete
    )?.id;

    const filteredReviews = professor.reviews.filter(review => (review.visible || review.id === selfReviewId) && !review.soft_delete);

    const canReview = guest && !selfReviewId && !guest.rated_professors.includes(professor.email);

    const cachedData = cache.get(email);
    const reviewsGuestTokens = professor.reviews.map(review => review.actor?.token).filter(Boolean);

    const similarlyRatedProfessors = cachedData || await ProfessorService.fetchSimilarProfessors(professor, reviewsGuestTokens);

    if (!cachedData) {
        cache.set(email, similarlyRatedProfessors);
    }

    const newProfessor = {
        ...professor,
        similarlyRated: similarlyRatedProfessors || [],
        canReview,
        reviews: await formatReviews(filteredReviews, selfReviewId, guestToken),
        score: calculateAverageScore(filteredReviews)
    };

    newProfessor.reviews.sort(sortReviews);

    res.status(200).json({success: true, professor: newProfessor});
}

export const getAll = async (req: Request, res: Response) => {
    const university = req.query.university as string ?? "United Arab Emirates University";

    const professors = await ProfessorService.getProfessors(university);

    res.status(200).json({professors});
}