import * as express from "express";
import {
    authenticate, fileAction,
    getPendingFiles,
    getPendingReviews,
    reviewAction,
    verifyToken
} from "../controllers/DashboardController";

const router = express.Router();

router.post("/authenticate", authenticate);
router.post("/verify", verifyToken);
router.get("/reviews", getPendingReviews);
router.get("/files", getPendingFiles);
router.post("/reviewAction", reviewAction);
router.post("/fileAction", fileAction);

export default router;