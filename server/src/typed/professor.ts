
export interface CommentBody {
    positive?: boolean | any;
    comment?: string | any;
    score?: number | any;
    attachments?: string[] | any;
    professorEmail?: string | any;
    recaptchaToken?: string | any;
}

export interface RatingBody {
    id: number,
    positive: boolean,
    request_key: string,
    type: "review" | "file"
}