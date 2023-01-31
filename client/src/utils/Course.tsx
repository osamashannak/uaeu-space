import {CourseData} from "./SearchBox";
import {ReactComponent as DocIcon} from "../assests/file-doc.svg";
import {ReactComponent as PdfIcon} from "../assests/file-pdf.svg";

export interface ICourse extends CourseData {
    files: IFile[]
}

export interface IFile {
    reference: string,
    name: string,
    type: FileType,
    size: number,
    created_at: string
}

export enum FileType {
    PDF,
    URL,
    DOC,
    PPT
}

export const formatBytes = (bytes: number, decimals: number = 1) => {
    if (!+bytes) return '0 B'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export const fileTypeToIcon = {
    0: <PdfIcon className={"review-icon"}/>,
    1: "URL",
    2: <DocIcon className={"review-icon"}/>,
    3: "PPT"
}