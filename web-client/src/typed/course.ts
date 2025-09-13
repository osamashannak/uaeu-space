

export interface CourseAPI {
    tag: string;
    name: string;
    files: CourseFileAPI[];
}

export interface CourseFileAPI {
    id: number;
    name: string;
    type: string;
    size: number;
    download_count: number;
    created_at: Date;
}