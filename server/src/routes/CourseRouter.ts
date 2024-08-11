import express from "express";
import {find, getAll, getFile, uploadFile} from "../controllers/CourseCtrl";
import multer from "multer";

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './tmp')
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix)
    }
})

const upload = multer({
    storage: storage,
    limits: {files: 1, fileSize: 100 * 1024 * 1024, fields: 2}
})


const router = express.Router();

router.get("/", find);
router.get("/all", getAll);
router.get("/file", getFile);
router.post("/file", upload.single("file"), uploadFile);

export default router;