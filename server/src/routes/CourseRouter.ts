import express from "express";
import {
    find,
    getAll,
    getFile,
    getFileRatings,
    rateFile,
    removeFileRating,
    uploadFiles
} from "../controllers/CourseCtrl";
const router = express.Router();

router.get("/", find);
router.get("/all", getAll);
router.get("/file", getFile);
router.post("/file", uploadFiles);
router.get("/file/rating", getFileRatings);
router.post("/file/rating", rateFile);
router.post("/file/rating/remove", removeFileRating);

export default router;