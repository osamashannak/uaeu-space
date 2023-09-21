import * as express from "express";
import {
    find,
    getAll,
    rate,
    upload
} from "../controllers/ProfessorCtrl";
import multer from "multer";

const uploadMulter = multer({
    storage: multer.memoryStorage(),
    limits: {files: 1, fileSize: 100 * 1024 * 1024},
    fileFilter(req, file: Express.Multer.File, cb: multer.FileFilterCallback) {
        const mimeTypes = ["image/jpeg", "image/png", "image/webp", "image/gif"];

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
router.post("/rate", rate);
router.post("/rate/upload", uploadMulter.single("file"), upload);


export default router;