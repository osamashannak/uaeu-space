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


