import {ProfessorAPI, ReviewAPI} from "@/interface/professor";
import {CourseAPI, CourseFileAPI} from "@/interface/course";

export interface AuthResponse {
    name: string;
    token: string;
}

export interface DashboardReviewAPI extends ReviewAPI {
    author_ip: string | null;
    visible: boolean;
    professor: ProfessorAPI;
}

export interface DashboardFileAPI extends CourseFileAPI {
    course: CourseAPI;
    downloads: number;
    vt_report: VTReport | null;
}

export interface VTReport {
    harmless: number;
    malicious: number;
    suspicious: number;
    timeout: number;
    undetected: number;
    error: number;
}