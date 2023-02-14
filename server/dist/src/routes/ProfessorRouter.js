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
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const ProfessorCtrl_1 = require("../controllers/ProfessorCtrl");
const router = express.Router();
router.get("/", ProfessorCtrl_1.find);
router.get("/all", ProfessorCtrl_1.getAll);
router.get("/rating", ProfessorCtrl_1.getRating); // PROFESSOR COMMENTS
router.get("/review/rating", ProfessorCtrl_1.getReviewRatings); // REVIEW LIKES/DISLIKES
router.post("/review/rating", ProfessorCtrl_1.rateReview);
router.post("/review/rating/remove", ProfessorCtrl_1.removeReviewRating);
router.post("/rate", ProfessorCtrl_1.rate);
exports.default = router;
