import {HOST} from "@/utils";
import {ProfessorItem} from "@/interface/searchbox";

export const saveCookies = async () => {
    const cookies = Object.entries(localStorage).map(([key, value]) => ({key, value}));

    try {
        await fetch(HOST + "/storeInCookies", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                token: cookies
            })
        });
    } catch (error) {
        return undefined;
    }

    return true;
}
