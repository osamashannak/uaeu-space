import * as express from "express";
import {authenticate, getProfile} from "../controllers/AuthCtrl";

const router = express.Router();

router.post("/", authenticate);
router.get("/profile", getProfile)

export default router;