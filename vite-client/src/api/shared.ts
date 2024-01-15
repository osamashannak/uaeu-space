
const HOST = import.meta.env.VITE_SERVER_ENDPOINT;

function uuidv4() {
    // @ts-ignore
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

export const addRating = async (id: number, positive: boolean, type: "review" | "file") => {

    let uuid = uuidv4();

    try {
        await fetch(HOST + "/shared/rating", {
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
        await fetch(HOST + `/shared/rating?key=${uuid}&type=${type}`, {
            method: "DELETE"
        });
    } catch (error) {
        return undefined;
    }

    return uuid;
}