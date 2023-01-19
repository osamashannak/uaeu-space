import mongoose from "mongoose";

interface IProfessor extends mongoose.Document {
    profId: string,
    name: string,
    email: string,
    ratings: [{ score: number, comment: string }],
}

const ProfessorSchema = new mongoose.Schema(
    {
        profId: {type: String, required: true},
        name: {type: String, required: true},
        email: {type: String, required: true},
        ratings: {type: Array, required: true},
    }
);

export const ProfessorModel = mongoose.model<IProfessor>("professor", ProfessorSchema);

ProfessorModel.createCollection().then();
