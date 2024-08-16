import {ImageAttachment, TenorGIFAttachment, VideoAttachment} from "./professor.ts";

export interface TimelineFormDraft {
    score?: number;
    positive?: boolean;
    comment: string;
    attachments: (ImageAttachment | TenorGIFAttachment | VideoAttachment)[];
}
export interface PostAPI {
    id: number;
    author: string;
    comment: string;
    created_at: Date;
    likes: number;
    comments: number;
    self: boolean;
    selfRating: boolean;
    fadeIn: boolean;
    attachments: {
        id: string;
        height: number;
        width: number;
        url: string;
    }[];
}

