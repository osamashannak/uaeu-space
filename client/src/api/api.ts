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
            url: HOST + "/api/professor/review/rating",
            params: {
                reviewId: reviewId
            }
        })
    } catch (error) {
        return undefined;
    }

    return response.data;
}

function uuidv4() {
    // @ts-ignore
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

export const rateReview = async (reviewId: number, positive: boolean) => {
    let uuid;
    try {
        uuid = uuidv4()
    } catch (e) {
        alert(e)
    }


    let response;

    try {
        response = await axios({
            method: "post",
            url: HOST + "/api/professor/review/rating",
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


export const removeReviewRating = async (request_key: string) => {
    let response;

    try {
        response = await axios({
            method: "post",
            url: HOST + "/api/professor/review/rating/remove",
            data: {
                request_key: request_key
            }
        })
    } catch (error) {
        return undefined;
    }

    return response.data.result === "success";
}

export const getFileRatings = async (fileId: number) => {
    let response;

    try {
        response = await axios({
            method: "get",
            url: HOST + "/api/course/file/rating",
            params: {
                id: fileId
            }
        })
    } catch (error) {
        return undefined;
    }

    return response.data;
}

export const rateFile = async (fileId: number, positive: boolean) => {
    const uuid = uuidv4();

    let response;

    try {
        response = await axios({
            method: "post",
            url: HOST + "/api/course/file/rating/",
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
            url: HOST + "/api/course/file/rating/remove",
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
    const form = new FormData();
    form.set("tag", courseTag);
    form.set("name", fileName);
    form.set("file", file);
    const response = await axios({
        method: "post",
        url: HOST + "/api/course/file",
        headers: {
            "content-type": "multipart/form-data"
        },
        data: form,
        onUploadProgress: (progressEvent) => {
            let percentComplete = Math.round(progressEvent.loaded * 100 / progressEvent.total!);

            if (percentComplete > 99) {
                setProgress(`Uploaded`);
                finishedUploading(file);
            } else {
                setProgress(`Uploading... ${percentComplete}%`);
            }

        }
    })

    return response.data.result === "success";
}