

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
}

export interface ReviewForm {
    author: string;
    score: number;
    positive: boolean;
    comment: string;
}