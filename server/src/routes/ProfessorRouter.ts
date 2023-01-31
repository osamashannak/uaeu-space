import * as express from "express";
import {
    find,
    getAll,
    getRating,
    getReviewRatings,
    rate,
    rateReview,
    removeReviewRating
} from "../controllers/ProfessorCtrl";

const router = express.Router();

router.get("/", find);
router.get("/all", getAll);
router.get("/rating", getRating); // PROFESSOR COMMENTS
router.get("/review/rating", getReviewRatings); // REVIEW LIKES/DISLIKES
router.post("/review/rating", rateReview);
router.post("/review/rating/remove", removeReviewRating);
router.post("/rate", rate);

export default router;