import * as express from "express";
import {
    find,
    getAll,
<<<<<<< HEAD
    rate,
    rateReview,
    removeReviewRating
=======
    rate
>>>>>>> d51fdb0 (major redesign: switch to nextjs, seo improvements)
} from "../controllers/ProfessorCtrl";

const router = express.Router();

router.get("/", find);
router.get("/all", getAll);
<<<<<<< HEAD
router.post("/review/rating", rateReview);
router.post("/review/rating/remove", removeReviewRating);
=======
>>>>>>> d51fdb0 (major redesign: switch to nextjs, seo improvements)
router.post("/rate", rate);

export default router;