import { Professor } from '@spaceread/database/entity/professor/Professor';
import { Guest } from '@spaceread/database/entity/user/Guest';

export interface CommentBody {
    positive: boolean;
    comment: string;
    score: number;
    attachments: string[];
    professorEmail: string;
    recaptchaToken: string;
}

export interface PostReview {
    professor: Professor,
    guest: Guest,
    positive: boolean,
    comment: string,
    score: number,
    attachments: string[],
    ipAddress: string,
}

export interface ReplyBody {
    content: {
        comment: string,
        gif?: string
    },
    reviewId: number,
    replyId?: number,
}

export interface RatingBody {
    reviewId: number,
    positive: boolean,
}