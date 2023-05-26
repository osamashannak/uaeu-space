import * as express from "express";
import {
    find,
    getAll,
    rate
} from "../controllers/ProfessorCtrl";

const router = express.Router();

router.get("/", find);
router.get("/all", getAll);
router.post("/rate", rate);

export default router;