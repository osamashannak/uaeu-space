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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = exports.find = exports.getReviewRatings = exports.removeReviewRating = exports.rateReview = exports.getRating = exports.rate = void 0;
const data_source_1 = require("../orm/data-source");
const Professor_1 = require("../orm/entity/Professor");
const typeorm_1 = require("typeorm");
const Review_1 = require("../orm/entity/Review");
const ReviewRatings_1 = require("../orm/entity/ReviewRatings");
const rate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const professor = yield data_source_1.AppDataSource.getRepository(Professor_1.Professor).findOne({
        where: { email: (0, typeorm_1.Equal)(body.professor) }
    });
    if (!professor) {
        res.status(200).json({ success: "failed-nop" });
        return;
    }
    const review = new Review_1.Review();
    review.author = body.review.author || "Anonymous";
    review.comment = body.review.comment;
    review.score = body.review.score;
    review.positive = body.review.positive;
    review.professor = professor;
    yield data_source_1.AppDataSource.getRepository(Review_1.Review).save(review);
    res.status(200).json({ result: "success" });
});
exports.rate = rate;
const getRating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const professor = yield data_source_1.AppDataSource.getRepository(Professor_1.Professor).findOne({
        where: { email: (0, typeorm_1.Equal)(body.email) },
        relations: ["reviews"],
        order: { reviews: { id: "asc" } }
    });
    if (!professor) {
        res.status(404).json({ error: "Professor not found." });
        return;
    }
    res.status(200).json({ reviews: professor.reviews || [] });
});
exports.getRating = getRating;
const rateReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    console.log(body);
    if (!body.reviewId || body.positive === null || !body.request_key) {
        res.status(400).json();
        return;
    }
    const review = yield data_source_1.AppDataSource.getRepository(Review_1.Review).findOne({
        where: { id: (0, typeorm_1.Equal)(body.reviewId) }
    });
    if (!review) {
        res.status(200).json({ error: "Review not found." });
        return;
    }
    const reviewRating = new ReviewRatings_1.ReviewRatings();
    reviewRating.request_key = body.request_key;
    reviewRating.is_positive = body.positive;
    reviewRating.review = review;
    yield data_source_1.AppDataSource.getRepository(ReviewRatings_1.ReviewRatings).save(reviewRating);
    res.status(200).json({ result: "success" });
});
exports.rateReview = rateReview;
const removeReviewRating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    if (!body.request_key) {
        res.status(400).json();
        return;
    }
    const reviewRating = yield data_source_1.AppDataSource.getRepository(ReviewRatings_1.ReviewRatings).findOne({
        where: { request_key: (0, typeorm_1.Equal)(body.request_key) }
    });
    if (!reviewRating) {
        console.log(body);
        res.status(200).json({ error: "Review rating not found." });
        return;
    }
    yield data_source_1.AppDataSource.getRepository(ReviewRatings_1.ReviewRatings).remove(reviewRating);
    res.status(200).json({ result: "success" });
});
exports.removeReviewRating = removeReviewRating;
const getReviewRatings = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = req.query;
    if (!params.reviewId) {
        res.status(400).json();
        return;
    }
    const review = yield data_source_1.AppDataSource.getRepository(Review_1.Review).findOne({
        where: { id: (0, typeorm_1.Equal)(parseInt(params.reviewId)) },
        relations: ["ratings"]
    });
    if (!review) {
        res.status(200).json({ error: "Review not found." });
        return;
    }
    let likes = 0;
    let dislikes = 0;
    review.ratings.forEach(value => {
        value.is_positive ? likes += 1 : dislikes += 1;
    });
    res.status(200).json({ likes: likes, dislikes: dislikes });
});
exports.getReviewRatings = getReviewRatings;
const find = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = req.query;
    if (!params.email) {
        res.status(400).json({ "request": "failed" });
        return;
    }
    const professor = yield data_source_1.AppDataSource.getRepository(Professor_1.Professor).findOne({
        where: { email: (0, typeorm_1.ILike)(params.email) },
        relations: ["reviews"],
        order: { reviews: { created_at: "desc" } },
    });
    if (!professor) {
        res.status(404).json({ error: "Professor not found." });
        return;
    }
    if (params.unique && params.unique === "true") {
        yield professor.addView(data_source_1.AppDataSource);
    }
    res.status(200).json({ professor: professor });
});
exports.find = find;
const getAll = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const professors = yield data_source_1.AppDataSource.getRepository(Professor_1.Professor).find({
        select: { name: true, email: true },
        order: { views: "desc" }
    });
    res.status(200).json({ professors: professors });
});
exports.getAll = getAll;
