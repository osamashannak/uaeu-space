import {ProfessorAPI, ReviewAPI, ReviewFormAPI, TenorGIFAttachment} from "../typed/professor.ts";
import {ProfessorItem} from "../typed/searchbox.ts";


const HOST = import.meta.env.VITE_SERVER_ENDPOINT;

export const getProfessorsList = async () => {
    let response;

    try {
        const request = await fetch(HOST + "/professor/all");
        response = await request.json();
    } catch (error) {
        return undefined;
    }

    return response['professors'] as ProfessorItem[];
}

export const getProfessor = async (id: string) => {
    let response;

    try {
        const request = await fetch(HOST + "/professor?email=" + id);
        response = await request.json();
    } catch (error) {
        return null;
    }

    return response['professor'] as ProfessorAPI ?? null;
}

export const uploadImageAttachment = async (file: File | Blob) => {
    let response;

    try {
        const formData = new FormData();
        formData.append("file", file);
        const request = await fetch(HOST + "/professor/comment/comment/uploadImage", {
            method: "POST",
            body: formData,
            headers: {
                'X-Csrf-Token': document.cookie.split(";").find((c) => c.trim().startsWith("k"))?.split("=")[1] ?? ""
            }
        });
        response = await request.json();
    } catch (error) {
        return undefined;
    }

    return response.id as string;
}

export const uploadTenorAttachment = async (tenorGIFAttachment: TenorGIFAttachment) => {
    let response;

    try {
        const request = await fetch(HOST + "/professor/comment/comment/uploadTenor", {
            method: "POST",
            body: JSON.stringify(tenorGIFAttachment),
            headers: {
                'X-Csrf-Token': document.cookie.split(";").find((c) => c.trim().startsWith("k"))?.split("=")[1] ?? ""
            }
        });
        response = await request.json();
    } catch (error) {
        return undefined;
    }

    return response.id as string;
}

export const uploadVideoAttachment = async (file: File | Blob) => {
    let response;

    try {
        const formData = new FormData();
        formData.append("file", file);
        const request = await fetch(HOST + "/professor/comment/uploadVideo", {
            method: "POST",
            body: formData,
            headers: {
                'X-Csrf-Token': document.cookie.split(";").find((c) => c.trim().startsWith("k"))?.split("=")[1] ?? ""
            }
        });
        response = await request.json();
    } catch (error) {
        return undefined;
    }

    return response.id as string;
}

export const postReview = async (options: ReviewFormAPI) => {
    let response;

    try {
        const request = await fetch(HOST + "/professor/comment", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'X-Csrf-Token': document.cookie.split(";").find((c) => c.trim().startsWith("k"))?.split("=")[1] ?? ""
            },
            body: JSON.stringify(options)
        });
        response = await request.json();
    } catch (error) {
        return undefined;
    }

    return response as { success: boolean, message: string, review: ReviewAPI };
}

export const addRating = async (id: number, positive: boolean, type: "review" | "file") => {

    const uuid = crypto.randomUUID();

    try {
        await fetch(HOST + "/professor/comment/rating", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                id: id,
                positive: positive,
                request_key: uuid,
                type: type
            })
        });
    } catch (error) {
        return undefined;
    }

    return uuid;
}

export const removeRating = async (uuid: string, type: "review" | "file") => {

    try {
        await fetch(HOST + `/professor/comment/rating?key=${uuid}&type=${type}`, {
            method: "DELETE"
        });
    } catch (error) {
        return undefined;
    }

    return uuid;
}