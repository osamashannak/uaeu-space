"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileRating = void 0;
const typeorm_1 = require("typeorm");
const CourseFile_1 = require("./CourseFile");
let FileRating = class FileRating {
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], FileRating.prototype, "request_key", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Boolean)
], FileRating.prototype, "is_positive", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => CourseFile_1.CourseFile, file => file.ratings),
    __metadata("design:type", CourseFile_1.CourseFile)
], FileRating.prototype, "file", void 0);
FileRating = __decorate([
    (0, typeorm_1.Entity)()
], FileRating);
exports.FileRating = FileRating;
