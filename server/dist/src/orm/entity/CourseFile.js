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
exports.CourseFile = void 0;
const typeorm_1 = require("typeorm");
const Course_1 = require("./Course");
const FileRating_1 = require("./FileRating");
let CourseFile = class CourseFile {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], CourseFile.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CourseFile.prototype, "blob_name", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => Course_1.Course, course => course.files),
    __metadata("design:type", Course_1.Course)
], CourseFile.prototype, "course", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CourseFile.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CourseFile.prototype, "type", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], CourseFile.prototype, "size", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: false }),
    __metadata("design:type", Boolean)
], CourseFile.prototype, "visible", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => FileRating_1.FileRating, ratings => ratings.file),
    __metadata("design:type", Array)
], CourseFile.prototype, "ratings", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CourseFile.prototype, "created_at", void 0);
CourseFile = __decorate([
    (0, typeorm_1.Entity)()
], CourseFile);
exports.CourseFile = CourseFile;
