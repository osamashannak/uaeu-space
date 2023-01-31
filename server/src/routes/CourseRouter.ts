import express from "express";
import {find, getAll, getFileRatings, getFiles, rateFile, removeFileRating, upload} from "../controllers/CourseCtrl";
const router = express.Router();

router.get("/", find);
router.get("/all", getAll);
router.get("/files", getFiles);
router.post("/file", upload);
router.get("/file/rating", getFileRatings);
router.post("/file/rating", rateFile);
router.post("/file/rating/remove", removeFileRating);

export default router;