const HOST = import.meta.env.VITE_SERVER_ENDPOINT;

export const addRating = async (id: number, positive: boolean, type: "review" | "file") => {

    const uuid = crypto.randomUUID();

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