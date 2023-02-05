import {formatBytes, getFontAwesomeIconFromMIME, IFile} from "../utils/Course";
import {dateHumanize} from "../utils/Global";
import {useTranslation} from "react-i18next";
import LikeDislike from "./FileRating";
import {Icon} from '@iconify/react';
import menuBookOutline from '@iconify/icons-material-symbols/menu-book-outline';
import {useState} from "react";

const FileTable = (props: { files: IFile[] }) => {

    const {t, i18n} = useTranslation();
    const [files, setFiles] = useState<IFile[]>(props.files);

    if (files.length < 1) {
        return (
            <div className={"files"}>
                <p className={"ratings-title"}><Icon icon={menuBookOutline} className={"review-icon"}/> Materials</p>

                <p className={"no-reviews"}>There are no materials for this course.</p>
            </div>
        )
    }

    return (
        <div className={"files"}>
            <p className={"ratings-title"}><Icon icon={menuBookOutline} className={"review-icon"}/> Materials</p>
            <div>
                {
                    props.files.map((value, index) => (
                        <div className={"file-row"}>
                            <span className={"file-name"}>
                                {getFontAwesomeIconFromMIME(value.type)}
                                <a target="_blank"
                                   style={{color: "#007fff"}}
                                   rel="noreferrer"
                                   href={"http://localhost:4000/api/course/file?id=" + value.id}
                                   title={value.name}>{value.name}</a>
                            </span>
                            <p className={"file-size"}>{formatBytes(value.size)}</p>
                            <p>{dateHumanize(value.created_at, i18n.language)}</p>
                            <LikeDislike fileId={value.id}/>
                        </div>
                    ))
                }
            </div>
        </div>
    );

}


export default FileTable;