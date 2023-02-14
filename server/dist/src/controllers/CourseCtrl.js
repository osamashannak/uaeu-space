"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFile = exports.uploadFile = exports.getFileRatings = exports.removeFileRating = exports.rateFile = exports.getAll = exports.find = void 0;
const data_source_1 = require("../orm/data-source");
const Course_1 = require("../orm/entity/Course");
const typeorm_1 = require("typeorm");
const CourseFile_1 = require("../orm/entity/CourseFile");
const FileRating_1 = require("../orm/entity/FileRating");
const FileAccessToken_1 = require("../orm/entity/FileAccessToken");
const azure_1 = require("../azure");
const util_1 = require("util");
const fs = __importStar(require("fs"));
const utils_1 = require("../utils");
const unlinkAsync = (0, util_1.promisify)(fs.unlink);
const find = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = req.query;
    if (!params.tag) {
        res.status(400).json({ "request": "failed" });
        return;
    }
    const course = yield data_source_1.AppDataSource.getRepository(Course_1.Course).findOne({
        where: { tag: (0, typeorm_1.ILike)(params.tag) },
        relations: ["files"],
        order: { files: { created_at: "desc" } },
    });
    if (!course) {
        res.status(404).json({ error: "Course not found." });
        return;
    }
    if (params.unique && params.unique === "true") {
        yield course.addView(data_source_1.AppDataSource);
    }
    res.status(200).json({ course: course });
});
exports.find = find;
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield data_source_1.AppDataSource.getRepository(Course_1.Course).find({
        select: { name: true, tag: true }, order: { views: "desc" }
    });
    res.status(200).json({ courses: courses });
});
exports.getAll = getAll;
const rateFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    if (!body.id || body.positive === null || !body.request_key) {
        res.status(400).json();
        return;
    }
    const file = yield data_source_1.AppDataSource.getRepository(CourseFile_1.CourseFile).findOne({
        where: { id: (0, typeorm_1.Equal)(body.id) }
    });
    if (!file) {
        res.status(200).json({ error: "File not found." });
        return;
    }
    const fileRating = new FileRating_1.FileRating();
    fileRating.request_key = body.request_key;
    fileRating.is_positive = body.positive;
    fileRating.file = file;
    yield data_source_1.AppDataSource.getRepository(FileRating_1.FileRating).save(fileRating);
    res.status(200).json({ result: "success" });
});
exports.rateFile = rateFile;
const removeFileRating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    if (!body.request_key) {
        res.status(400).json();
        return;
    }
    const fileRating = yield data_source_1.AppDataSource.getRepository(FileRating_1.FileRating).findOne({
        where: { request_key: (0, typeorm_1.Equal)(body.request_key) }
    });
    if (!fileRating) {
        console.log(body);
        res.status(200).json({ error: "File rating not found." });
        return;
    }
    yield data_source_1.AppDataSource.getRepository(FileRating_1.FileRating).remove(fileRating);
    res.status(200).json({ result: "success" });
});
exports.removeFileRating = removeFileRating;
const getFileRatings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = req.query;
    if (!params.id) {
        res.status(400).json();
        return;
    }
    const file = yield data_source_1.AppDataSource.getRepository(CourseFile_1.CourseFile).findOne({
        where: { id: (0, typeorm_1.Equal)(parseInt(params.id)) },
        relations: ["ratings"]
    });
    if (!file) {
        res.status(200).json({ error: "File not found." });
        return;
    }
    let likes = 0;
    let dislikes = 0;
    file.ratings.forEach(value => {
        value.is_positive ? likes += 1 : dislikes += 1;
    });
    res.status(200).json({ likes: likes, dislikes: dislikes });
});
exports.getFileRatings = getFileRatings;
const uploadFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (!(file && req.body.tag && req.body.name)) {
        res.status(400).json({ error: "File type is not allowed" });
        return;
    }
    const filePath = yield (0, utils_1.compressFile)(file.path);
    if (!filePath) {
        res.status(400).json({});
        return;
    }
    const blobName = yield (0, azure_1.uploadBlob)(req.body.name, filePath, file.mimetype);
    yield unlinkAsync(file.path);
    const courseFile = new CourseFile_1.CourseFile();
    courseFile.course = req.body.tag;
    courseFile.blob_name = blobName;
    courseFile.size = file.size;
    courseFile.name = req.body.name;
    courseFile.type = file.mimetype;
    yield data_source_1.AppDataSource.getRepository(CourseFile_1.CourseFile).save(courseFile);
});
exports.uploadFile = uploadFile;
const getFile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = req.query;
    //let address = requestIp.getClientIp(req);
    let address = "176.205.83.27";
    if (!(params.id && address)) {
        res.status(400).json();
        return;
    }
    if (address.includes(":")) {
        address = address.split(":").slice(-1).pop();
    }
    let fileAccessToken = yield data_source_1.AppDataSource.getRepository(FileAccessToken_1.FileAccessToken).findOne({
        where: {
            client_address: address
        }
    });
    if (!fileAccessToken || fileAccessToken.expires_on < new Date()) {
        if (!address) {
            res.status(401).json();
            return;
        }
        const queryParams = (0, azure_1.generateToken)(address);
        console.log(queryParams);
        fileAccessToken = new FileAccessToken_1.FileAccessToken();
        fileAccessToken.url = queryParams.toString();
        fileAccessToken.expires_on = queryParams.expiresOn;
        fileAccessToken.client_address = address;
        yield data_source_1.AppDataSource.getRepository(FileAccessToken_1.FileAccessToken).save(fileAccessToken);
    }
    let courseFile = yield data_source_1.AppDataSource.getRepository(CourseFile_1.CourseFile).findOne({
        where: {
            id: (0, typeorm_1.Equal)(parseInt(params.id))
        }
    });
    //if (!(courseFile && courseFile.visible)) {
    if (!(courseFile)) {
        res.status(404).json({});
        return;
    }
    const fileUrl = (0, azure_1.getFileURL)(courseFile.blob_name, fileAccessToken.url);
    res.status(200).redirect(fileUrl);
});
exports.getFile = getFile;
