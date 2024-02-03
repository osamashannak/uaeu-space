import * as express from "express";
import {
    comment,
    find,
    getAll,
    upload
} from "../controllers/ProfessorCtrl";
import multer from "multer";
import ffmpeg from 'fluent-ffmpeg';

const command = ffmpeg();

const uploadMulter = multer({
    storage: multer.memoryStorage(),
    limits: {files: 1, fileSize: 100 * 1024 * 1024},
    fileFilter(req, file: Express.Multer.File, cb: multer.FileFilterCallback) {
        const mimeTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'video/mp4', 'video/quicktime'];

        if (!mimeTypes.includes(file.mimetype)) {
            cb(null, false);
            return;
        }

        console.log(file)

        ffmpeg.ffprobe(file.path, function(err, metadata) {
            if (err) {
                console.log(err)
                cb(null, false);
                return;
            }

            console.log(metadata)
        });
    }
})

const router = express.Router();

router.get("/", find);
router.get("/all", getAll);
router.post("/rate", comment);
router.post("/rate/upload", uploadMulter.single("file"), upload);


export default router;