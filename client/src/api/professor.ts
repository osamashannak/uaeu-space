import {ProfessorAPI, ReviewForm} from "@/interface/professor";
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

export const postReview = async (details: ReviewForm, professorEmail: string, recaptchaToken: string) => {
    let response;

    try {
        const request = await fetch(HOST + "/professor/rate", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                review: details,
                professor: professorEmail,
                recaptchaToken: recaptchaToken
            })
        });
        response = await request.json();
    } catch (error) {
        return undefined;
    }

    console.log(response)

    return response.result === "success";
}