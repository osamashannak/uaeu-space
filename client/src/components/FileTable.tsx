import {fileTypeToIcon, formatBytes, IFile} from "../utils/Course";
import {dateHumanize} from "../utils/Global";
import {useTranslation} from "react-i18next";
import LikeDislike from "./FileRating";
import {ReactComponent as BookIcon} from "../assests/menu-book-outline.svg";
import {useState} from "react";

const FileTable = (props: { files: IFile[] }) => {

    const {t, i18n} = useTranslation();
    const [files, setFiles] = useState<IFile[]>(props.files);

    if (files.length < 1) {
        return (
            <div className={"files"}>
                <p className={"ratings-title"}><BookIcon className={"review-icon"}/> Materials</p>


                <p className={"no-reviews"}>There are no materials for this course.</p>
            </div>
        )
    }

    return (
        <div className={"files"}>
            <p className={"ratings-title"}><BookIcon className={"review-icon"}/> Materials</p>
            <div>
                {
                    props.files.map((value, index) => (
                        <div className={"file-row"}>
                            <span className={"file-name"}>
                                {fileTypeToIcon[value.type]}
                                <a target="_blank"
                                   style={{color: "#007fff"}}
                                   rel="noreferrer"
                                   href={"https://google.com"}
                                   title={value.name}>{value.name}</a>
                            </span>
                            <p className={"file-size"}>{formatBytes(value.size)}</p>
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