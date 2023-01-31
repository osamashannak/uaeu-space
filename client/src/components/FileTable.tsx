import {ReactComponent as Ellipses} from "../assests/dots-vertical.svg";
import {useEffect} from "react";
import {fileTypeToIcon, formatBytes, IFile} from "../utils/Course";
import {dateHumanize} from "../utils/Global";
import {useTranslation} from "react-i18next";
import {namespaces} from "../i18n";
import LikeDislike from "./FileRating";
import {ReactComponent as BookIcon} from "../assests/menu-book-outline.svg";

const FileTable = (props: { files: IFile[] }) => {
    const {t, i18n} = useTranslation();

    return (
        <div className={"files"}>
            <p className={"ratings-title"}><BookIcon className={"review-icon"}/> Materials</p>
            <div>
                {
                    props.files.map((value, index) => (
                        <div className={"file-row"}>
                            <span>
                                {fileTypeToIcon[value.type]}
                                <a target="_blank"
                                   rel="noreferrer"
                                   href={"https://google.com"}>{value.name}</a>
                            </span>
                            <p>{formatBytes(value.size)}</p>
                            <p>{dateHumanize(value.created_at, i18n.language)}</p>
                            <LikeDislike fileReference={value.reference}/>
                        </div>
                    ))
                }
            </div>
        </div>
    );

}


export default FileTable;