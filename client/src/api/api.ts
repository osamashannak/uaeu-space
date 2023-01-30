import axios from 'axios';
import {IProfessor, IReview} from "../utils/Professor";
import {ICourse} from "../utils/Course";


const HOST = "http://localhost:4000";

export const getProfessor = async (professorEmail: string, unique?: string) => {
    let response;

    try {
        response = await axios({
            method: "get",
            url: HOST+"/api/professor",
            params: {
                email: professorEmail,
                unique: unique
            }
        })
    } catch (error) {
        return undefined;
    }

    return response.data.professor as IProfessor;
}

export const getCoursesList = async () => {
    let response;

    try {
        response = await axios({
            method: "get",
            url: HOST+"/api/course/all"
        })
    } catch (error) {
        return undefined;
    }

    return response.data.courses as ICourse[];
}

export const getProfessorsList = async () => {
    let response;

    try {
        response = await axios({
            method: "get",
            url: HOST+"/api/professor/all"
        })
    } catch (error) {
        return undefined;
    }

    return response.data.professors as IProfessor[];
}
export const postReview = async (review: IReview, email: string) => {
    let response;

    try {
        response = await axios({
            method: "post",
            url: HOST+"/api/professor/rate",
            data: {
                review: review,
                professor: email
            }
        })
    } catch (error) {
        return undefined;
    }

    return response.data.result === "success";
}

export const getCourse = async (tag: string, unique?: string) => {
    let response;

    try {
        response = await axios({
            method: "get",
            url: HOST+"/api/course",
            params: {
                tag: tag,
                unique: unique
            }
        })
    } catch (error) {
        return undefined;
    }

    return response.data.course as ICourse;
}