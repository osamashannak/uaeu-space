import * as express from "express";
import {
    addRating, comment, deleteComment, deleteReply,
    find,
    getAll, getReplies, getReplyName, likeReply, postReply, removeLikeReply,
    removeRating,
    uploadImage, uploadTenor
} from "../controllers/ProfessorCtrl";
import multer from "multer";
import {getCredentials} from "../utils";
import cors from "cors";
import {Response} from "express";

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

router.use(cors({
    origin: "https://spaceread.net",
    credentials: true
}));

router.get("/", getCredentials, find);
router.get("/all", cors(), getAll);
router.post("/comment", getCredentials, comment);
router.delete("/comment", getCredentials, deleteComment);
router.post("/comment/attachment/uploadImage", uploadMulter.single("file"), uploadImage);
router.post("/comment/attachment/uploadTenor", uploadTenor);


router.post("/comment/rating", getCredentials, addRating);
router.delete("/comment/rating", getCredentials, removeRating);

router.get("/comment/reply", getCredentials, getReplies);
router.get("/comment/reply/name", getCredentials, getReplyName);
router.post("/comment/reply", getCredentials, postReply);
router.delete("/comment/reply", getCredentials, deleteReply);
router.post("/comment/reply/like", getCredentials, likeReply);
router.delete("/comment/reply/like", getCredentials, removeLikeReply);

function setHeaders(allowMethods: string, allowHeaders: string) {
    return (req: express.Request, res: express.Response) => {
        res.setHeader('Access-Control-Allow-Origin', 'https://spaceread.net');
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader('Access-Control-Allow-Methods', allowMethods);
        res.setHeader('Access-Control-Allow-Headers', allowHeaders);
        res.status(200).send();
    }
}

router.options("/", setHeaders('GET', 'content-type, x-csrf-token'));
router.options("/comment", setHeaders('POST, DELETE', 'content-type, x-csrf-token'));
router.options("/comment/rating", setHeaders('POST, DELETE', 'content-type, x-csrf-token'));

router.options("/comment/reply", setHeaders('GET, POST, DELETE', 'content-type, x-csrf-token'));
router.options("/comment/reply/like", setHeaders('POST, DELETE', 'content-type, x-csrf-token'));
router.options("/comment/reply/name", setHeaders('GET', 'content-type, x-csrf-token'));

export default router;