
export interface ProfessorItem {
    name: string;
    email: string;
}

export interface CourseItem {
    tag: string;
    name: string;
}

export type Item = ProfessorItem | CourseItem;