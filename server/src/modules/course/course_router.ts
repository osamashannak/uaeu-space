import express from "express";
import {find, getAll, getFile, uploadFile} from "./course_controller";
import {fileMulter} from "../../middlewares/multer";
import {getCredentials} from "../../middlewares/authentication";
import {setHeaders} from "../../utils/utils";

const router = express.Router();

router.use((req, res, next) => {
    setHeaders(req, res);
    next()
})

router.get("/", find);
router.get("/all", getAll);
router.get("/file", getFile);
router.post("/file", getCredentials, fileMulter.single("file"), uploadFile);

export default router;