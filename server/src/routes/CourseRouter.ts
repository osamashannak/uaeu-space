import express from "express";
<<<<<<< HEAD
import {find, getAll, getFile, getFileRatings, rateFile, removeFileRating, uploadFile} from "../controllers/CourseCtrl";
=======
import {find, getAll, getFile, uploadFile} from "../controllers/CourseCtrl";
>>>>>>> d51fdb0 (major redesign: switch to nextjs, seo improvements)
import multer from "multer";
import {ALLOWED_APPLICATION_TYPES, ALLOWED_TYPES} from "../utils";

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
    limits: {files: 1, fileSize: 100 * 1024 * 1024, fields: 2},
    fileFilter(req, file: Express.Multer.File, cb: multer.FileFilterCallback) {
        console.log(file.mimetype + " " + file.size);

        const type = file.mimetype.split('/')[0]!;

        if (!(ALLOWED_TYPES.includes(type) || ALLOWED_APPLICATION_TYPES.includes(file.mimetype))) {
            cb(null, false);
            return;
        }

        cb(null, true);
    }
})


const router = express.Router();


router.get("/", find);
router.get("/all", getAll);
router.get("/file", getFile);
router.post("/file", upload.single("file"), uploadFile);
<<<<<<< HEAD
router.get("/file/rating", getFileRatings);
router.post("/file/rating", rateFile);
router.post("/file/rating/remove", removeFileRating);
=======
>>>>>>> d51fdb0 (major redesign: switch to nextjs, seo improvements)

export default router;