import axios from 'axios';
import {IProfessor, IReviewForm} from "../utils/Professor";
import {ICourse} from "../utils/Course";
import {createUploadForm, onUploadProgress} from "./utils";
import {IProfile, RatingType} from "../utils/Global";


const HOST = "http://localhost:8080";

export const auth = async (migrationData: (string | { key: string; value: string; })[]) => {
    let response;

    try {
        response = await axios({
            method: "post",
            url: HOST + "/auth",
            data: {
                migrationData: migrationData
            }
        })
    } catch (error) {
        return undefined;
    }

    return response.data.clientKey;
}

export const getProfile = async (clientKey: string) => {
    let response;

    try {
        response = await axios({
            method: "get",
            url: HOST + "/auth/profile",
            params: {
                clientKey: clientKey
            }
        })
    } catch (error) {
        return undefined;
    }

    return response.data.profile as IProfile;
}

export const getProfessor = async (professorEmail: string, clientKey: string) => {
    let response;

    try {
        response = await axios({
            method: "get",
            url: HOST + "/professor",
            headers: {
                "client-key": clientKey
            },
            params: {
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
export const postReview = async (review: IReviewForm, email: string, token: string, clientKey: string) => {
    let response;

    try {
        response = await axios({
            method: "post",
            url: HOST + "/professor/rate",
            headers: {
                "client-key": clientKey
            },
            data: {
                token: token,
                review: review,
                professor: email
            }
        })
    } catch (error) {
        return undefined;
    }

    return response.data.result;
}

export const getCourse = async (tag: string, clientKey: string) => {
    let response;

    try {
        response = await axios({
            method: "get",
            url: HOST + "/course",
            headers: {
                "client-key": clientKey
            },
            params: {
                tag: tag
            }
        })
    } catch (error) {
        return undefined;
    }

    return response.data.course as ICourse;
}

export const addRating = async (id: number, positive: boolean, type: RatingType, clientKey: string) => {
    let response;

    try {
        response = await axios({
            method: "post",
            url: HOST + "/rating",
            headers: {
                "client-key": clientKey
            },
            data: {
                id: id,
                positive: positive,
                type: type
            }
        })
    } catch (error) {
        return undefined;
    }

    return response;
}

export const uploadFile = async (data: { fileName: string, file: File, courseTag: string, progressFunction: any, finishedFunction: any }, clientKey: string): Promise<boolean> => {

    const response = await axios({
        method: "post",
        url: HOST + "/course/file",
        headers: {
            "client-key": clientKey,
            "content-type": "multipart/form-data",
        },
        data: createUploadForm(data.courseTag, data.fileName, data.file),
        onUploadProgress: onUploadProgress(data.progressFunction, data.finishedFunction, data.file)
    })

    return response.data.result === "success";
}