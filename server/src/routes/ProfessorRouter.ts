import * as express from "express";
import {
    find,
    getAll, review,
} from "../controllers/ProfessorCtrl";

const router = express.Router();

router.get("/", find);
router.get("/all", getAll);
router.post("/rate", review);

export default router;