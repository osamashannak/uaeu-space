import {ProfessorAPI, ReviewAPI, ReviewFormAPI, TenorGIFAttachment} from "../typed/professor.ts";
import {ProfessorItem} from "../typed/searchbox.ts";


const HOST = import.meta.env.VITE_SERVER_ENDPOINT;

export const getProfessorsList = async (university: string) => {
    let response;

    try {
        const request = await fetch(HOST + "/professor/all?university=" + university);
        response = await request.json();
    } catch (error) {
        return undefined;
    }

    return response['professors'] as ProfessorItem[];
}

export const getProfessor = async (id: string) => {
    let response;

    try {
        const request = await fetch(HOST + "/professor?email=" + id, {
            credentials: "include",
        });
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
        const request = await fetch(HOST + "/professor/comment/attachment/uploadImage", {
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
        const request = await fetch(HOST + "/professor/comment/attachment/uploadTenor", {
            method: "POST",
            body: JSON.stringify({
                url: tenorGIFAttachment.url,
                height: tenorGIFAttachment.height,
                width: tenorGIFAttachment.width
            }),
            headers: {
                'Content-Type': 'application/json',
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
        const request = await fetch(HOST + "/professor/comment/attachment/uploadVideo", {
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
            body: JSON.stringify(options),
            credentials: "include"
        });
        response = await request.json();
    } catch (error) {
        return undefined;
    }

    return response as { success: boolean, message: string, review: ReviewAPI };
}

export const deleteReview = async (reviewId: number) => {
    let response;

    try {
        const request = await fetch(HOST + "/professor/comment?id=" + reviewId, {
            method: "DELETE",
            headers: {
                'Content-Type': 'application/json',
                'X-Csrf-Token': document.cookie.split(";").find((c) => c.trim().startsWith("k"))?.split("=")[1] ?? ""
            },
            credentials: "include"
        });
        response = await request.json();
    } catch (error) {
        return undefined;
    }

    return response as { success: boolean, message: string };
}

export const addRating = async (reviewId: number, positive: boolean) => {

    try {
        await fetch(HOST + "/professor/comment/rating", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                reviewId,
                positive
            }),
            credentials: "include"
        });
    } catch (error) {
        return false;
    }

    return true;
}

export const removeRating = async (reviewId: number) => {

    try {
        await fetch(HOST + `/professor/comment/rating?reviewId=${reviewId}`, {
            method: "DELETE",
            credentials: "include"
        });
    } catch (error) {
        return false;
    }

    return true;
}