import { Document, model, Schema } from "mongoose";

export type TCourse = {
    email: string;
    password: string;
    avatar: string;
};

export interface IUser extends TCourse, Document {}

const courseSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    avatar: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});

const User = model<IUser>("Course", courseSchema);

export default User;