
export interface Question {
    text: string;
    type: "radio" | "multi" | "text";
    options?: string[];
}

export interface FeedbackResponse {
    text: string;
    options?: string[];
    type: "radio" | "multi" | "text";
    remaining_count?: number;
}

export interface NewFeedbackResponse {
    feedback_id: string;
    complete: boolean;
    question?: FeedbackResponse;
    remaining_count: number;

}

