import {checkSchema} from "express-validator";

const CommentValidator= checkSchema({
    professorEmail: {
        in: ["body"],
        exists: true,
        isEmail: true,
    },
    comment: {
        in: ["body"],
        optional: true,
        trim: true,
        isLength: {
            options: { max: 350 },
        },
    },
    attachments: {
        in: ["body"],
        optional: true,
        isArray: true,
        customSanitizer: {
            options: (attachments: any) =>
                Array.isArray(attachments)
                    ? attachments.filter((attachment: any) => typeof attachment === "string").slice(0, 4)
                    : [],
        },
    },
    score: {
        in: ["body"],
        exists: true,
        isInt: {
            options: { min: 1, max: 5 },
        },
        toInt: true,
    },
    positive: {
        in: ["body"],
        exists: true,
        isBoolean: true,
        toBoolean: true,
    },
});

export default CommentValidator;