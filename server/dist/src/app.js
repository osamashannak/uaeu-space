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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const CourseRouter_1 = __importDefault(require("./routes/CourseRouter"));
const ProfessorRouter_1 = __importDefault(require("./routes/ProfessorRouter"));
const body_parser_1 = __importDefault(require("body-parser"));
const data_source_1 = require("./orm/data-source");
const azure_1 = require("./azure");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: "https://uaeu.space" }));
app.use(body_parser_1.default.urlencoded({ extended: true, limit: "100mb" }));
app.use(body_parser_1.default.json({ limit: "100mb" }));
app.use("/course", CourseRouter_1.default);
app.use("/professor", ProfessorRouter_1.default);
const port = process.env.PORT || 4000;
const main = () => {
    (0, azure_1.loadAzure)().then(r => console.log("Azure client loaded."));
    data_source_1.AppDataSource.initialize().then(() => __awaiter(void 0, void 0, void 0, function* () {
        /*
                console.log("Inserting a new user into the database...")
                const professor = await AppDataSource.manager.getRepository(Course).findOne({where: {tag: "MATH110"}})
                const file = new CourseFile();
                file.created_at = new Date();
                file.reference = "sofmpqvjvirodfdsfdse";
                file.course = professor!;
                file.name = "practice-test-study-01.pdf"
                file.size = 10000000;
                file.type = FileType.PDF;

                await AppDataSource.getRepository(CourseFile).save(file);*/
    })).catch(error => console.log(error));
    app.listen(port, () => {
        console.log(`Socket is listening on port ${port}`);
    });
};
main();
exports.default = app;
