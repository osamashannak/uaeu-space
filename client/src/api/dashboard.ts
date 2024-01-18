import {AuthResponse, DashboardFileAPI, DashboardReviewAPI} from "@/interface/dashboard";

const HOST = "https://api.uaeu.space";

export const authDashboard = async (token: string) => {
    let response;

    try {
        const request = await fetch(HOST + "/dashboard/authenticate", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({token: token})
        });
        response = await request.json();
    } catch (error) {
        return undefined;
    }

    return response as AuthResponse;
}

export const verifyToken = async (token: string) => {
    let response;

    try {
        const request = await fetch(HOST + "/dashboard/verify", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({token: token})
        });
        response = await request.json();
    } catch (error) {
        return undefined;
    }

    return response as {name: string};
}

export const getPendingReviews = async (token: string) => {
    let response;

    try {
        const request = await fetch(HOST + "/dashboard/reviews", {
            method: "GET",
            headers: {
                'Authorization': token
            }
        });
        response = await request.json();
    } catch (error) {
        return undefined;
    }

    return response as DashboardReviewAPI[];
}

export const getPendingFiles = async (token: string) => {
    let response;

    try {
        const request = await fetch(HOST + "/dashboard/files", {
            method: "GET",
            headers: {
                'Authorization': token
            }
        });
        response = await request.json();
    } catch (error) {
        return undefined;
    }

    return response as DashboardFileAPI[];
}

export const reviewAction = async (reviewId: number, action: string, token: string) => {
    let response;

    try {
        const request = await fetch(HOST + "/dashboard/reviewAction", {
            method: "POST",
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({reviewId: reviewId, action: action})
        });
        response = await request.json();
    } catch (error) {
        return undefined;
    }

    return response;
}

export const fileAction = async (fileId: number, action: string, token: string) => {
    let response;

    try {
        const request = await fetch(HOST + "/dashboard/fileAction", {
            method: "POST",
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({fileId: fileId, action: action})
        });
        response = await request.json();
    } catch (error) {
        return undefined;
    }

    return response;
}

export const getProfessorReviews = async (token: string, email: string) => {
    let response;

    try {
        const request = await fetch(`${HOST}/dashboard/reviews?email=${email}`, {
            method: "GET",
            headers: {
                'Authorization': token,
            }
        });
        response = await request.json();
    } catch (error) {
        return undefined;
    }

    return response as DashboardReviewAPI[];
}