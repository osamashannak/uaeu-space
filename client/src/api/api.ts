import axios from 'axios';
import {IReview} from "../utils/Professor";

export const getProfessor = async (professorEmail: string) => {
    let response;

    try {
        response = await axios({
            method: "get",
            url: "http://192.168.1.17:4000/api/professor",
            params: {
                'email': professorEmail
            }
        })
    } catch (error) {
        return undefined;
    }

    return response.data.professor;
}

// TODO remove port
export const getCoursesList = async () => {
    let response;

    try {
        response = await axios({
            method: "get",
            url: "http://192.168.1.17:4000/api/course/all"
        })
    } catch (error) {
        return undefined;
    }

    return response.data.courses;
}

export const getProfessorsList = async () => {
    let response;

    try {
        response = await axios({
            method: "get",
            url: "http://192.168.1.17:4000/api/professor/all"
        })
    } catch (error) {
        return undefined;
    }

    return response.data.professors;
}

export const postReview = async (review: IReview, email: string) => {
    let response;

    try {
        response = await axios({
            method: "post",
            url: "http://192.168.1.17:4000/api/professor/rate",
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