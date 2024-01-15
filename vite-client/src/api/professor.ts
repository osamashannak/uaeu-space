import {ProfessorAPI, ReviewFormAPI} from "../typed/professor.ts";
import {ProfessorItem} from "../typed/searchbox.ts";


const HOST = import.meta.env.VITE_SERVER_ENDPOINT;

export const getProfessorsList = async () => {
    let response;

    try {
        const request = await fetch(HOST + "/professor/all", {
            cache: "no-cache"
        });
        response = await request.json();
    } catch (error) {
        return undefined;
    }

    return response['professors'] as ProfessorItem[];
}

export const getProfessor = async (id: string) => {
    console.log(HOST)
    let response;

    try {
        const request = await fetch(HOST + "/professor?email=" + id, {
            cache: "no-cache"
        });
        response = await request.json();
    } catch (error) {
        return null;
    }

    return response['professor'] as ProfessorAPI ?? null;
}

export const uploadAttachment = async (file: File | Blob) => {
    let response;

    try {
        const formData = new FormData();
        formData.append("file", file);
        const request = await fetch(HOST + "/professor/rate/upload", {
            method: "POST",
            body: formData
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
        const request = await fetch(HOST + "/professor/rate", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(options)
        });
        response = await request.json();
    } catch (error) {
        return undefined;
    }

    return response.result === "success";
}