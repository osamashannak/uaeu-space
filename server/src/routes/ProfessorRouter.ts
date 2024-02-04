import * as express from "express";
import {
    comment,
    find,
    getAll,
    upload
} from "../controllers/ProfessorCtrl";
import multer from "multer";
import crypto from "crypto";
import {getCredentials} from "../utils";


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './tmp')
    },
    filename: (req, file, cb) => {
        cb(null, crypto.randomUUID());
    }
})

const videoMulter = multer({
    storage: storage,
    limits: {files: 1, fileSize: 100 * 1024 * 1024},
    fileFilter(req, file: Express.Multer.File, cb: multer.FileFilterCallback) {
        const mimeTypes = ['video/mp4', 'video/quicktime'];

        if (!mimeTypes.includes(file.mimetype)) {
            cb(null, false);
            return;
        }

        cb(null, true);

    }
})

const imageMulter = multer({
    storage: multer.memoryStorage(),
    limits: {files: 1, fileSize: 100 * 1024 * 1024},
    fileFilter(req, file: Express.Multer.File, cb: multer.FileFilterCallback) {
        const mimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

        if (!mimeTypes.includes(file.mimetype)) {
            cb(null, false);
            return;
        }

        cb(null, true);

    }
})

const router = express.Router();

router.get("/", find);
router.get("/all", getAll);
router.post("/rate", getCredentials, comment);
router.post("/rate/upload", imageMulter.single("file"), upload);
// router.post("/rate/uploadVideo", videoMulter.single("file"), uploadVideo);


export default router;