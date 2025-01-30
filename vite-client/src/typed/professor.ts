
export interface ProfessorAPI {
    email: string;
    name: string;
    college: string;
    university: string;
    reviews: ReviewAPI[];
    score: number;
    canReview: boolean;
    similarlyRated: SimilarProfessors[]
}

export interface SimilarProfessors {
    professor_email: string;
    professor_name: string;
    professor_college: string;
    reviewCount: number;
    review: string;
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
    comments: number;
    self: boolean;
    selfRating: boolean | null;
    fadeIn: boolean;
    uaeuOrigin: boolean;
    attachments: {
        id: string;
        height: number;
        width: number;
        url: string;
    }[];
}

export interface ReviewReplyAPI {
    id: number;
    author: string;
    comment: string;
    gif: string | null;
    mention?: string;
    likes: number;
    self: boolean;
    selfLike: boolean;
    op: boolean;
    created_at: Date;
    fadeIn?: boolean;
}


export interface ImageAttachment {
    id: string;
    url: string;
    height: number;
    width: number;
    weight: 1
    src: File | Blob;
}

export interface VideoAttachment {
    id: string;
    url: string;
    weight: 4;
    height: number;
    width: number;
    videoSrc: File | Blob;
}

export interface TenorGIFAttachment {
    id: string;
    url: string;
    height: number;
    width: number;
    weight: 4;
}

export interface ReviewFormDraft {
    score?: number;
    positive?: boolean;
    comment: string;
    attachments: (ImageAttachment | TenorGIFAttachment | VideoAttachment)[];
}

export interface ReviewFormAPI {
    professorEmail: string;
    recaptchaToken: string;
    score: number;
    positive: boolean;
    comment: string;
    attachments: string[];
}

export interface ProfessorHistory {
    name: string;
    email: string;
    university: string;
    date: Date;
}

export interface ReviewComposeProps {
    id: number;
    reviewId: number;
    author: string;
    comment: string;
    replyMention?: string;
    mention?: number;
    op: boolean;
    created_at: Date;
    showReplyCompose: (show: boolean) => void;
}

export interface ReplyContent {
    comment: string | "";
    gif: TenorGIFAttachment | null;
}
