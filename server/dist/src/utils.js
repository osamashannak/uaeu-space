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
exports.unlinkAsync = exports.ALLOWED_TYPES = exports.ALLOWED_APPLICATION_TYPES = exports.compressFile = void 0;
const fs_1 = require("fs");
const zlib_1 = require("zlib");
const util_1 = require("util");
const fs_2 = __importDefault(require("fs"));
const compressFile = (filePath) => __awaiter(void 0, void 0, void 0, function* () {
    const stream = (0, fs_1.createReadStream)(filePath);
    const newPath = `${filePath}.gz`;
    return yield new Promise((resolve, reject) => {
        stream
            .pipe((0, zlib_1.createGzip)())
            .pipe((0, fs_1.createWriteStream)(newPath))
            .on("finish", () => resolve(newPath))
            .on('error', () => reject(null));
    });
});
exports.compressFile = compressFile;
exports.ALLOWED_APPLICATION_TYPES = [
    "application/pdf",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/gzip",
    "application/zip",
    "application/x-7z-compressed",
    "application/vnd.rar"
];
exports.ALLOWED_TYPES = [
    "image",
    "audio",
    "video"
];
exports.unlinkAsync = (0, util_1.promisify)(fs_2.default.unlink);
