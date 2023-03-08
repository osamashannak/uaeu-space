import {formatBytes, getFontAwesomeIconFromMIME, IFile} from "../utils/Course";
import {dateHumanize} from "../utils/Global";
import {useTranslation} from "react-i18next";
import LikeDislike from "./FileRating";
import {Icon} from '@iconify/react';
import menuBookOutline from '@iconify/icons-material-symbols/menu-book-outline';
import {namespaces} from "../i18n";

const FileTable = (props: { files: IFile[] }) => {

    const {t, i18n} = useTranslation(namespaces.pages.course);

    if (props.files.length < 1) {
        return (
            <div className={"files"}>
                <p className={"no-reviews"}>{t("errors.no_materials")}</p>
            </div>
        )
    }

    return (
        <div className={"files"}>
            {
                props.files.map((value, index) => (
                    <div key={index} className={"file-row"}>
                            <span className={"file-name"}>
                                {getFontAwesomeIconFromMIME(value.type)}
                                <a target="_blank"
                                   style={{color: "#007fff"}}
                                   rel="noreferrer nofollow"
                                   href={"https://api.uaeu.space/course/file?id=" + value.id}
                                   title={value.name}>{value.name}</a>
                            </span>
                        <p className={"file-size"}>{formatBytes(value.size)}</p>
                        <p>{dateHumanize(value.created_at, i18n.language || window.localStorage.i18nextLng)}</p>
                        <LikeDislike fileId={value.id}/>
                    </div>
                ))
            }
        </div>
    );

}


export default FileTable;