export interface ProfessorAPI {
    email: string;
    name: string;
    college: string;
    reviews: ReviewAPI[];
    score: number;
}

export interface ReviewAPI {
    id: number;
    author: string;
    score: number;
    positive: boolean;
    comment: string;
    created_at: Date;
    likes: number;
    dislikes: number;
    reviewed: boolean;
    attachment: {
        id: string;
        width: number;
        height: number;
    } | null;
}

export interface ReviewFormAttachment {
    file: File | Blob;
    url: string;
    aspectRatio: number;
    id: string;
}

export interface ReviewFormDraft {
    score?: number;
    positive?: boolean;
    comment: string;
    attachment: ReviewFormAttachment[];
}

export interface ReviewFormAPI {
    professorEmail: string;
    recaptchaToken: string;
    score: number;
    positive: boolean;
    comment: string;
    attachments: string[];
}
