import * as express from "express";
import {find, getRating, rate} from "../controllers/ProfessorCtrl";

const router = express.Router();

router.get("/", find);
router.get("/rating", getRating);
router.post("/rate", rate);

export default router;