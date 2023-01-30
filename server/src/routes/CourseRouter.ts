import express from "express";
import {find, getAll, getFiles, upload} from "../controllers/CourseCtrl";

const router = express.Router();

router.get("/", find);
router.get("/all", getAll);
router.get("/files", getFiles);
router.post("/file", upload);

export default router;