import {CourseItem} from "../typed/searchbox.ts";
import {CourseAPI} from "../typed/course.ts";

const HOST = import.meta.env.VITE_COURSE_ENDPOINT;

export const getCoursesList = async () => {
    let response;

    try {
        const request = await fetch(HOST + "/course/list", {
            cache: "no-cache"
        });
        response = await request.json();
    } catch (error) {
        return undefined;
    }

    return response as CourseItem[];
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

    return response as CourseAPI ?? null;
}

export const uploadFile = async (fileName: string, file: File, courseTag: string): Promise<boolean> => {
    const form = new FormData();
    form.set("tag", courseTag);
    form.set("name", fileName);
    form.set("file", file);

    const response = await fetch(HOST + "/course/upload", {
        method: "POST",
        body: form
    });

    const data = await response.json();

    return data.result === "success";
}

export const getDownloadLink = (fileId: number) => {
    return HOST + "/course/download?fileId=" + fileId;
}