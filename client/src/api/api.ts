import axios from 'axios';
import qs from 'qs';

export const getProfessor = async (professorEmail: string) => {
    let response;

    try {
        response = await axios({
            method: "get",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            url: "http://localhost:4000/api/professor",
            params: {
                'email': professorEmail
            }
        })
    } catch (error) {
        return undefined;
    }

    return response.data.professor;
}


export const getReviews = async (email: string) => {

}