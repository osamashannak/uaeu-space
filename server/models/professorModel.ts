import mongoose from "mongoose";

const professorSchema = new mongoose.Schema(
    {
        profId: {type: String, required: true},
        name: {type: String, required: true},
        email: {type: String, required: true},
        ratings: {type: Array, required: false},
    }
);

export const ProfessorModel = mongoose.model("professor", professorSchema);