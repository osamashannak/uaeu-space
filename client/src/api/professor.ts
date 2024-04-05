import {ProfessorAPI, ReviewFormAPI} from "@/interface/professor";
import {HOST} from "@/utils";
import {ProfessorItem} from "@/interface/searchbox";

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
        return undefined;
    }

    return response['professor'] as ProfessorAPI ?? null ;
}

export const uploadAttachment = async (file: File | Blob) => {
    let response;

    try {
        const formData = new FormData();
        formData.append("file", file);
        const request = await fetch(HOST + "/professor/comment/attachment/uploadImage", {
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
        const request = await fetch(HOST + "/professor/comment", {
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

export const addRating = async (id: number, positive: boolean, type: "review" | "file") => {

    let uuid = crypto.randomUUID();

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