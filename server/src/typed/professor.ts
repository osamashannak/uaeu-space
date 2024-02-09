
export interface CommentBody {
    positive?: boolean;
    comment?: string;
    score?: number;
    attachments?: string[];
    professorEmail?: string;
    recaptchaToken?: string;
}