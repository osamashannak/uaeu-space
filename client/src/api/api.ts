import axios from 'axios';
import {IProfessor, IReview} from "../utils/Professor";
import {ICourse} from "../utils/Course";


const HOST = "http://192.168.1.17:4000";

export const getProfessor = async (professorEmail: string, unique?: string) => {
    let response;

    try {
        response = await axios({
            method: "get",
            url: HOST + "/api/professor",
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
            url: HOST + "/api/course/all"
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
            url: HOST + "/api/professor/all"
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
            url: HOST + "/api/professor/rate",
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
            url: HOST + "/api/course",
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

export const getReviewRatings = async (reviewId: number) => {
    let response;

    try {
        response = await axios({
            method: "get",
            url: HOST + "/api/professor/review/",
            params: {
                reviewId: reviewId
            }
        })
    } catch (error) {
        return undefined;
    }

    return response.data;
}

export const rateReview = async (reviewId: number, positive: boolean) => {
    const uuid = crypto.randomUUID();

    let response;

    try {
        response = await axios({
            method: "post",
            url: HOST + "/api/professor/review/rate",
            data: {
                reviewId: reviewId,
                positive: positive,
                request_key: uuid
            }
        })
    } catch (error) {
        return undefined;
    }

    return uuid;
}

export const removeReview = async (request_key: string) => {
    let response;

    try {
        response = await axios({
            method: "post",
            url: HOST + "/api/professor/review/removerate",
            data: {
                request_key: request_key
            }
        })
    } catch (error) {
        return undefined;
    }

    return response.data.result === "success";
}