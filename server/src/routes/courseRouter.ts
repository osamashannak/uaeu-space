import express from "express";
import {find, getFiles, upload} from "../controllers/courseCtrl";

const router = express.Router();

router.get("/", find);
router.get("/files", getFiles);
router.post("/file", upload);

export default router;