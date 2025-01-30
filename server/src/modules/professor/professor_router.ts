import * as express from "express";
import {getCredentials} from "../../middlewares/authentication";
import {attachmentMulter} from "../../middlewares/multer";
import {setHeaders} from "../../utils/utils";
import {
    find,
    getAll,
} from "./professor_controller";
import {deleteReply, getReplies, getReplyName, likeReply, postReply, removeLikeReply} from "./reply_controller";
import {addRating, comment, deleteComment, removeRating, uploadImage, uploadTenor} from "./comment_controller";
import CommentValidator from "../../validators/comment";
import {schemaValidation} from "../../middlewares/error_handling";

const router = express.Router();

router.use((req, res, next) => {
    setHeaders(req, res);
    next();
});

router.get("/", getCredentials, find);
router.get("/all", getAll);

router.post("/comment", getCredentials, CommentValidator, schemaValidation, comment);
router.delete("/comment", getCredentials, deleteComment);
router.post("/comment/attachment/uploadImage", attachmentMulter.single("file"), uploadImage);
router.post("/comment/attachment/uploadTenor", uploadTenor);
router.post("/comment/rating", getCredentials, addRating);
router.delete("/comment/rating", getCredentials, removeRating);

router.get("/comment/reply", getCredentials, getReplies);
router.get("/comment/reply/name", getCredentials, getReplyName);
router.post("/comment/reply", getCredentials, postReply);
router.delete("/comment/reply", getCredentials, deleteReply);
router.post("/comment/reply/like", getCredentials, likeReply);
router.delete("/comment/reply/like", getCredentials, removeLikeReply);

export default router;