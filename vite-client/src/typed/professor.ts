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
    attachments: {
        id: string;
        height: number;
        width: number;
        url: string;
    }[];
}


export interface ImageAttachment {
    id: string;
    url: string;
    aspectRatio: number;
    weight: 1
    src: File | Blob;
}

export interface VideoAttachment {
    id: string;
    url: string;
    weight: 4;
    aspectRatio: number;
    videoSrc: File | Blob;
}

export interface TenorGIFAttachment {
    id: string;
    url: string;
    aspectRatio: number;
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
