
export interface CommentBody {
    positive?: boolean | any;
    comment?: string | any;
    score?: number | any;
    attachments?: string[] | any;
    professorEmail?: string | any;
    recaptchaToken?: string | any;
}

export interface ReplyBody {
    comment: string,
    reviewId: number,
    replyId?: number,
}

export interface RatingBody {
    reviewId: number,
    positive: boolean,
}