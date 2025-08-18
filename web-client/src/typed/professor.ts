export interface ProfessorAPI {
    email: string;
    name: string;
    college: string;
    university: string;
    reviews: ReviewAPI[];
    score: number;
    reviewed: boolean;
    similar_professors: SimilarProfessors[]
}

export interface SimilarProfessors {
    professor_email: string;
    professor_name: string;
    professor_college: string;
    reviews_count: number;
    review_preview: string;
    score: number;
}

export interface ReviewAPI {
    id: number;
    author: string;
    score: number;
    positive: boolean;
    text: string;
    created_at: Date;
    like_count: number;
    dislike_count: number;
    reply_count: number;
    language: string;
    self: boolean;
    rated: boolean | null;
    fadeIn: boolean;
    uaeu_origin: boolean;
    attachment?: {
        id: string;
        height: number;
        width: number;
        url: string;
    };
}

export interface ReviewReplyAPI {
    id: number;
    author: string;
    comment: string;
    gif: string | null;
    mention?: string;
    like_count: number;
    self: boolean;
    liked: boolean;
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
    attachment?: ImageAttachment | TenorGIFAttachment;
}

export interface ReviewFormAPI {
    professor_email: string;
    recaptcha_token: string;
    score: number;
    positive: boolean;
    text: string;
    attachment?: string;
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
