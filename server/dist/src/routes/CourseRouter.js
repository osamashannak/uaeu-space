"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const CourseCtrl_1 = require("../controllers/CourseCtrl");
const multer_1 = __importDefault(require("multer"));
const utils_1 = require("../utils");
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './tmp');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = file.fieldname + '-' + uniqueSuffix;
        cb(null, fileName);
        req.on('aborted', () => {
            file.stream.on('end', () => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, utils_1.unlinkAsync)(`./tmp/${fileName}`);
            }));
            file.stream.emit('end');
        });
    }
});
const upload = (0, multer_1.default)({
    storage: storage,
    limits: { files: 1, fileSize: 100 * 1024 * 1024, fields: 2 },
    fileFilter(req, file, cb) {
        console.log(file.mimetype + " " + file.size);
        const type = file.mimetype.split('/').pop();
        if (!(utils_1.ALLOWED_TYPES.includes(type) || utils_1.ALLOWED_APPLICATION_TYPES.includes(file.mimetype))) {
            cb(null, false);
            return;
        }
        cb(null, true);
    }
});
const router = express_1.default.Router();
router.get("/", CourseCtrl_1.find);
router.get("/all", CourseCtrl_1.getAll);
router.get("/file", CourseCtrl_1.getFile);
router.post("/file", upload.single("file"), CourseCtrl_1.uploadFile);
router.get("/file/rating", CourseCtrl_1.getFileRatings);
router.post("/file/rating", CourseCtrl_1.rateFile);
router.post("/file/rating/remove", CourseCtrl_1.removeFileRating);
exports.default = router;
