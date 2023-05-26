import {ProfessorAPI, ReviewAPI} from "@/interface/professor";
import {CourseAPI, CourseFileAPI} from "@/interface/course";

export interface AuthResponse {
    name: string;
    token: string;
}

export interface DashboardReviewAPI extends ReviewAPI {
    author_ip: string | null;
    professor: ProfessorAPI;
}

export interface DashboardFileAPI extends CourseFileAPI {
    course: CourseAPI;
    downloads: number;
}