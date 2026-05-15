import {useEffect, useState} from "react";
import styles from "../../styles/components/course/file_upload.module.scss";
import {uploadFile} from "../../api/course.ts";
import {formatBytes, getIconFromMIME} from "../../utils.tsx";

export default function FilePreview(props: {
    courseTag: string,
    name: string,
    file: File,
    changeName: any,
    uploadFile: boolean,
    finishedUploading: any,
    deleteFile: any
}) {

    const [progress, setProgress] = useState("Ready to upload");
    const [name, setName] = useState(props.name);

    useEffect(() => {
        if (props.uploadFile) {
            setProgress("Uploading...")

            uploadFile(
                name,
                props.file,
                props.courseTag)
                .then(() => {
                    setProgress(`Uploaded`);
                    props.finishedUploading(props.file);
                })
                .catch((error) => {
                    setProgress(`Error: ${error}`);
                });
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.uploadFile]);


    return (
        <div className={styles.filePreview}>
            <div className={styles.filePreviewIcon}>
                {getIconFromMIME(props.file.type)}
            </div>
            <div className={styles.filePreviewBody}>
                <input
                    type={"text"}
                    onChange={event => {
                        setName(event.target.value);
                        props.changeName(props.file, event.target.value);
                    }}
                    disabled={progress !== "Ready to upload"}
                    className={styles.filePreviewName}
                    defaultValue={props.name}
                    aria-label={"File name"}/>
                <div className={styles.filePreviewMeta}>
                    <span>{formatBytes(props.file.size)}</span>
                    <span className={styles.metaDivider}/>
                    <span>{progress}</span>
                </div>
            </div>
            <div hidden={progress !== "Ready to upload"} className={styles.deleteWrapper}>
                <button
                    className={styles.deleteIcon}
                    type={"button"}
                    onClick={() => props.deleteFile(props.file)}
                    aria-label={`Remove ${props.name}`}
                >
                    <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="22px" height="22px"
                         viewBox="0 0 24 24">
                        <path fill="currentColor"
                              d="M5 21V6H4V4h5V3h6v1h5v2h-1v15H5Zm2-2h10V6H7v13Zm2-2h2V8H9v9Zm4 0h2V8h-2v9ZM7 6v13V6Z"/>
                    </svg>
                </button>
            </div>

        </div>
    )
}
