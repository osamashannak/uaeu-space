import * as express from "express";
import {
    addRating, comment, deleteComment,
    find,
    getAll,
    removeRating,
    uploadImage, uploadTenor
} from "../controllers/ProfessorCtrl";
import multer from "multer";
import {getCredentials} from "../utils";
import cors from "cors";

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
router.get("/all", cors(), getAll);
router.post("/comment", getCredentials, comment);
router.delete("/comment", getCredentials, deleteComment);
router.post("/comment/attachment/uploadImage", cors(), uploadMulter.single("file"), uploadImage);
router.post("/comment/attachment/uploadTenor", cors(), uploadTenor);

router.post("/comment/rating", getCredentials, addRating);
router.delete("/comment/rating", getCredentials, removeRating);

router.options("/", (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://spaceread.net');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.status(200).send();
});
router.options("/comment", (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://spaceread.net');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'POST');
    res.setHeader('Access-Control-Allow-Headers', 'content-type, x-csrf-token');
    res.status(200).send();
});
router.options("/comment/rating", (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://spaceread.net');
    res.setHeader('Access-Control-Allow-Credentials', 'true');
    res.setHeader('Access-Control-Allow-Methods', 'POST, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'content-type, x-csrf-token');
    res.status(200).send();
});

export default router;