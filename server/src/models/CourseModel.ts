import mongoose from "mongoose";

interface ICourse extends mongoose.Document {
    name: string,
    tag: string,
    fullName: string,
    files: { approved: [Buffer], review: [Buffer] }
}

const courseSchema = new mongoose.Schema(
    {
        name: {type: String, required: true},
        tag: {type: String, required: true},
        fullName: {type: String, required: true},
        files: {type: Array, required: true}
    }
);

export const CourseModel = mongoose.model<ICourse>("course", courseSchema);