import * as express from "express";
import {
    find,
    getAll,
    rate,
    rateReview,
    removeReviewRating
} from "../controllers/ProfessorCtrl";

const router = express.Router();

router.get("/", find);
router.get("/all", getAll);
router.post("/review/rating", rateReview);
router.post("/review/rating/remove", removeReviewRating);
router.post("/rate", rate);

export default router;