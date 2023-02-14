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
var Professor_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Professor = void 0;
const typeorm_1 = require("typeorm");
const Review_1 = require("./Review");
let Professor = Professor_1 = class Professor {
    addView(conn) {
        const userRepo = conn.getRepository(Professor_1);
        this.views += 1;
        return userRepo.save(this);
    }
};
__decorate([
    (0, typeorm_1.PrimaryColumn)(),
    __metadata("design:type", String)
], Professor.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Professor.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Professor.prototype, "college", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => Review_1.Review, review => review.professor),
    __metadata("design:type", Array)
], Professor.prototype, "reviews", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: 0 }),
    __metadata("design:type", Number)
], Professor.prototype, "views", void 0);
Professor = Professor_1 = __decorate([
    (0, typeorm_1.Entity)()
], Professor);
exports.Professor = Professor;
