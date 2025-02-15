import {CourseItem} from "../typed/searchbox.ts";
import {CourseAPI} from "../typed/course.ts";

const HOST = import.meta.env.VITE_SERVER_ENDPOINT;

export const getCoursesList = async () => {
    let response;

    try {
        const request = await fetch(HOST + "/course/all", {
            cache: "no-cache"
        });
        response = await request.json();
    } catch (error) {
        return undefined;
    }

    return response['courses'] as CourseItem[];
}

export const getCourse = async (id: string) => {
    let response;

    try {
        const request = await fetch(HOST + "/course?tag=" + id, {
            cache: "no-cache"
        });
        response = await request.json();
    } catch (error) {
        return undefined;
    }

    return response['course'] as CourseAPI ?? null;
}

export const uploadFile = async (fileName: string, file: File, courseTag: string): Promise<boolean> => {
    const form = new FormData();
    form.set("tag", courseTag);
    form.set("name", fileName);
    form.set("file", file);

    const response = await fetch(HOST + "/course/file", {
        method: "POST",
        body: form
    });

    const data = await response.json();

    return data.result === "success";
}