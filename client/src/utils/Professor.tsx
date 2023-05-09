import {ProfData} from "./SearchBox";

export interface IProfessor extends ProfData {
    college: string,
    reviews: IReview[]
}

export interface ReviewRatings {
    id: string,
    is_positive: boolean
}

export interface IReview {
    id: number,
    author: string,
    positive: boolean,
    comment: string,
    score: number,
    likes: number,
    dislikes: number,
    created_at: string
}

export interface IReviewForm {
    author: string,
    positive: boolean,
    comment: string,
    score: number
}