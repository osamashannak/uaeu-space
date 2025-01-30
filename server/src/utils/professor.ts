import {Review} from "@spaceread/database/entity/professor/Review";
import {isUAEUIp} from "./utils";
import {ProfessorService} from "../app";

export const formatReviews = async (reviews: Review[], selfReviewId: number| undefined, guestToken: string) => {
    return await Promise.all(
        reviews.map(async review => {
            const likes = review.ratings.filter(rating => rating.value).length;
            const dislikes = review.ratings.filter(rating => !rating.value).length;

            const attachments = review.attachments
                ? await ProfessorService.fetchAttachments(review.attachments)
                : null;

            const selfRating = guestToken
                ? review.ratings.find(rating => rating.actor?.token === guestToken)?.value
                : null;

            return {
                id: review.id,
                score: review.score,
                positive: review.positive,
                comment: review.comment,
                created_at: review.created_at,
                author: review.actor?.user?.username || "Guest",
                likes,
                dislikes,
                comments: review.replies.filter(reply => !reply.soft_delete).length,
                attachments,
                self: review.id === selfReviewId,
                hidden: !review.visible && review.id === selfReviewId || undefined,
                selfRating,
                uaeuOrigin: isUAEUIp(review.author_ip)
            };
        })
    );
};


export const calculateAverageScore = (reviews: Review[]) => {
    const totalScore = reviews.reduce((sum, review) => sum + review.score, 0);
    return totalScore / Math.max(reviews.length, 1);
};

interface SortReview {
    created_at: string | number | Date;
    likes: number;
    dislikes: number;
    score: number;
}

export const sortReviews = (a: SortReview, b: SortReview) => {
    const oneWeek = 7 * 24 * 60 * 60 * 1000;
    const sixMonths = 6 * 30 * 24 * 60 * 60 * 1000;
    const now = Date.now();

    const aDate = new Date(a.created_at).getTime();
    const bDate = new Date(b.created_at).getTime();

    const aLikes = a.likes - a.dislikes;
    const bLikes = b.likes - b.dislikes;

    const aNew = now - aDate < oneWeek;
    const bNew = now - bDate < oneWeek;

    const aOld = now - aDate > sixMonths;
    const bOld = now - bDate > sixMonths;

    if (aNew !== bNew) return aNew ? -1 : 1;
    if (aOld !== bOld) return aOld ? 1 : -1;

    if (a.score === 1 || a.score === 5) {
        if (b.score === 1 || b.score === 5) {
            return bLikes - aLikes || bDate - aDate;
        }
        return -1;
    }

    if (b.score === 1 || b.score === 5) return 1;
    return bLikes - aLikes || bDate - aDate;
};

