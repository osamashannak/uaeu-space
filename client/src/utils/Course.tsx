import {CourseData} from "./SearchBox";
import {Icon, IconifyIcon} from '@iconify/react';
import fileTypePdf2 from '@iconify/icons-vscode-icons/file-type-pdf2';
import fileTypePowerpoint2 from '@iconify/icons-vscode-icons/file-type-powerpoint2';
import fileTypeWord2 from '@iconify/icons-vscode-icons/file-type-word2';
import fileTypeZip from '@iconify/icons-vscode-icons/file-type-zip';
import fileTypeImage from '@iconify/icons-vscode-icons/file-type-image';
import fileTypeAudio from '@iconify/icons-vscode-icons/file-type-audio';
import fileTypeVideo from '@iconify/icons-vscode-icons/file-type-video';
import defaultFile from '@iconify/icons-vscode-icons/default-file';

export interface ICourse extends CourseData {
    files: IFile[]
}

export interface IFile {
    id: number,
    name: string,
    type: string,
    size: number,
    created_at: string
}

export const formatBytes = (bytes: number, decimals: number = 1) => {
    if (!+bytes) return '0 B'

    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/*const iconClasses: { [key: string]: JSX.Element } = {
    // Media
    "image": <Icon icon={fileTypeImage} className={"file-type-icon"}/>,
    "audio": <Icon icon={fileTypeAudio} className={"file-type-icon"}/>,
    "video": <Icon icon={fileTypeVideo} className={"file-type-icon"}/>,
    // Documents
    "application/pdf": <Icon icon={fileTypePdf2} className={"file-type-icon"}/>,
    "application/msword": <Icon icon={fileTypeWord2} className={"file-type-icon"}/>,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": <Icon icon={fileTypeWord2} className={"file-type-icon"}/>,
    "application/vnd.ms-powerpoint": <Icon icon={fileTypePowerpoint2} className={"file-type-icon"}/>,
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": <Icon icon={fileTypePowerpoint2} className={"file-type-icon"}/>,
    // Archives
    "application/gzip": <Icon icon={fileTypeZip} className={"file-type-icon"}/>,
    "application/zip": <Icon icon={fileTypeZip} className={"file-type-icon"}/>,
    "application/x-7z-compressed": <Icon icon={fileTypeZip} className={"file-type-icon"}/>,
    "application/vnd.rar": <Icon icon={fileTypeZip} className={"file-type-icon"}/>
};*/

const iconClasses: { [key: string]: IconifyIcon } = {
    // Media
    "image": fileTypeImage,
    "audio": fileTypeAudio,
    "video": fileTypeVideo,
    // Documents
    "application/pdf": fileTypePdf2,
    "application/msword": fileTypeWord2,
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": fileTypeWord2,
    "application/vnd.ms-powerpoint": fileTypePowerpoint2,
    "application/vnd.openxmlformats-officedocument.presentationml.presentation": fileTypePowerpoint2,
    // Archives
    "application/gzip": fileTypeZip,
    "application/zip": fileTypeZip,
    "application/x-7z-compressed": fileTypeZip,
    "application/vnd.rar": fileTypeZip
};

export function getFontAwesomeIconFromMIME(mimeType: string): JSX.Element {

    const candidate = Object.entries(iconClasses).find(([k]) =>
        mimeType.startsWith(k)
    )

    if (candidate === undefined) {
        return <Icon icon={defaultFile} className={"file-type-icon"}/>;
    } else {
        return <Icon icon={candidate[1]} className={"file-type-icon"}/>;
    }

}
