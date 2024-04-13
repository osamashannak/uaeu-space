import * as express from "express";
import {
    addRating, comment,
    find,
    getAll,
    removeRating,
    uploadImage, uploadTenor
} from "../controllers/ProfessorCtrl";
import multer from "multer";
import {getCredentials} from "../utils";

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

router.get("/", getCredentials, find);
router.get("/all", getAll);
router.post("/comment", getCredentials, comment);
router.post("/comment/attachment/uploadImage", uploadMulter.single("file"), uploadImage);
router.post("/comment/attachment/uploadTenor", uploadTenor);

router.post("/comment/rating", getCredentials, addRating);
router.delete("/comment/rating", getCredentials, removeRating);

export default router;