import axios from 'axios';
import {IProfessor, IReview} from "../utils/Professor";
import {ICourse} from "../utils/Course";
import {createUploadForm, onUploadProgress, uuidv4} from "./utils";


const HOST = "https://api.uaeu.space";

export const auth = async () => {
    let response;

    try {
        response = await axios({
            method: "get",
            url: HOST + "/auth"
        })
    } catch (error) {
        return undefined;
    }

    return response.data.sessionKey;
}

export const getProfessor = async (professorEmail: string, sessionKey: string | null) => {
    if (!sessionKey) {
        sessionKey = await auth();
    }

    let response;

    try {
        response = await axios({
            method: "get",
            url: HOST + "/professor",
            params: {
                sessionKey: sessionKey,
                email: professorEmail
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
            url: HOST + "/course/all"
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
            url: HOST + "/professor/all"
        })
    } catch (error) {
        return undefined;
    }

    return response.data.professors as IProfessor[];
}
export const postReview = async (review: IReview, email: string, sessionKey: string | null) => {
    if (!sessionKey) {
        sessionKey = await auth();
    }

    let response;

    try {
        response = await axios({
            method: "post",
            url: HOST + "/professor/rate",
            data: {
                sessionKey: sessionKey,
                review: review,
                professor: email
            }
        })
    } catch (error) {
        return undefined;
    }

    return response.data.result === "success";
}

export const getCourse = async (tag: string, viewed: boolean, sessionKey: string | null) => {
    if (!sessionKey) {
        sessionKey = await auth();
    }

    let response;

    try {
        response = await axios({
            method: "get",
            url: HOST + "/course",
            params: {
                sessionKey: sessionKey,
                tag: tag,
                viewed: viewed
            }
        })
    } catch (error) {
        return undefined;
    }

    return response.data.course as ICourse;
}

export const rateReview = async (reviewId: number, positive: boolean, sessionKey: string | null) => {
    if (!sessionKey) {
        sessionKey = await auth();
    }

    let response;

    try {
        response = await axios({
            method: "post",
            url: HOST + "/professor/review/rating",
            data: {
                sessionKey: sessionKey,
                reviewId: reviewId,
                positive: positive
            }
        })
    } catch (error) {
        return undefined;
    }

    return response;
}


export const removeReviewRating = async (request_key: string, reviewId: number, sessionKey: string | null) => {
    if (!sessionKey) {
        sessionKey = await auth();
    }

    let response;

    try {
        response = await axios({
            method: "post",
            url: HOST + "/professor/review/rating/remove",
            data: {
                sessionKey: sessionKey,
                reviewId: reviewId
            }
        })
    } catch (error) {
        return undefined;
    }

    return response.data.result === "success";
}

export const rateFile = async (fileId: number, positive: boolean) => {
    const uuid = uuidv4();

    let response;

    try {
        response = await axios({
            method: "post",
            url: HOST + "/course/file/rating/",
            data: {
                id: fileId,
                positive: positive,
                request_key: uuid
            }
        })
    } catch (error) {
        return undefined;
    }

    return uuid;
}

export const removeFileRating = async (request_key: string) => {
    let response;

    try {
        response = await axios({
            method: "post",
            url: HOST + "/course/file/rating/remove",
            data: {
                request_key: request_key
            }
        })
    } catch (error) {
        return undefined;
    }

    return response.data.result === "success";
}

export const uploadFile = async (fileName: string, file: File, courseTag: string, setProgress: any, finishedUploading: any): Promise<boolean> => {

    const response = await axios({
        method: "post",
        url: HOST + "/course/file",
        headers: {
            "content-type": "multipart/form-data"
        },
        data: createUploadForm(courseTag, fileName, file),
        onUploadProgress: onUploadProgress(setProgress, finishedUploading, file)
    })

    return response.data.result === "success";
}