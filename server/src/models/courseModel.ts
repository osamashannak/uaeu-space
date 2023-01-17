import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
    {
            courseId: {type: String, required: true},
            name: String,
            short: String,
            number: Number,
            files: {approved: [Buffer], review: [Buffer]}
    }
);

export const CourseModel = mongoose.model("course", courseSchema);