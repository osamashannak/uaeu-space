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
router.get("/rating", getRating);
router.get("/review", getReviewRatings);
router.post("/review/rate", rateReview);
router.post("/review/removerate", removeReviewRating);
router.post("/rate", rate);

export default router;