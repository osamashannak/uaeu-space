

const HOST = import.meta.env.VITE_AUTH_SERVER_ENDPOINT;

export async function sendLonginRequest(id: string, password: string) {
    let response;

    try {
        response = await fetch(HOST + "/gate/login", {
            method: "POST",
            body: JSON.stringify({id: id, password: password}),
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        })
    } catch (error) {
        return undefined;
    }

    return response;
}

export async function sendSignUpRequest(id: string, email: string, password: string) {
    let response;

    try {
        response = await fetch(HOST + "/gate/signup", {
            method: "POST",
            body: JSON.stringify({id, email, password}),
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        })
    } catch (error) {
        return undefined;
    }

    return response;
}

export async function sendGoogleLogin(credential: string) {
    let response;

    try {
        response = await fetch(HOST + "/gate/googleLogin", {
            method: "POST",
            body: JSON.stringify({credential}),
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        })
    } catch (error) {
        return undefined;
    }

    return response;
}

export async function sendGoogleSignup(googleId: string, email: string, username: string) {
    let response;

    try {
        response = await fetch(HOST + "/gate/googleSignup", {
            method: "POST",
            body: JSON.stringify({googleId, email, username}),
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        })
    } catch (error) {
        return undefined;
    }

    return response;
}


export async function whoAmI() {
    let response;

    try {
        response = await fetch(HOST + "/gate/whoami", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include"
        })
    } catch (error) {
        return undefined;
    }

    return response;
}