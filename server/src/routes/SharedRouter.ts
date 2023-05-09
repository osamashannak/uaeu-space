import * as express from "express";
import {addRating, removeRating} from "../controllers/SharedCtrl";

const router = express.Router();

router.post("/", addRating);
router.post("/remove", removeRating);

export default router;