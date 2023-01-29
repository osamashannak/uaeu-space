import * as express from "express";
import {find, getAll, getRating, rate} from "../controllers/ProfessorCtrl";

const router = express.Router();

router.get("/", find);
router.get("/all", getAll);
router.get("/rating", getRating);
router.post("/rate", rate);

export default router;