

export interface CourseAPI {
    tag: string;
    name: string;
    files: CourseFileAPI[];
}

export interface CourseFileAPI {
    id: number;
    blob_name: string;
    name: string;
    type: string;
    size: number;
    likes: number;
    dislikes: number;
    downloads: number;
    created_at: Date;
}