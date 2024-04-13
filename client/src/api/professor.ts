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