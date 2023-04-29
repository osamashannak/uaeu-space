import {AxiosProgressEvent} from "axios";


export const createUploadForm = (courseTag: string, fileName: string, file: Blob) => {
    const form = new FormData();
    form.set("tag", courseTag);
    form.set("name", fileName);
    form.set("file", file);
    return form;
}

export const onUploadProgress = (setProgress: any, finishedUploading: any, file: Blob) => {
    return (progressEvent: AxiosProgressEvent) => {
        let percentComplete = Math.round(progressEvent.loaded * 100 / progressEvent.total!);

        if (percentComplete > 99) {
            setProgress(`Uploaded`);
            finishedUploading(file);
        } else {
            setProgress(`Uploading... ${percentComplete}%`);
        }
    }
}

export const uuidv4 = () => {
    // @ts-ignore
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}
