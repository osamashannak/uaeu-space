import * as express from "express";
import {addRating, removeRating} from "../controllers/SharedCtrl";

const router = express.Router();

router.post("/rating", addRating);
router.delete("/rating", removeRating);

export default router;