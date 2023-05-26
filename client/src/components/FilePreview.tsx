import {useEffect, useState} from "react";
<<<<<<< HEAD
import {uploadFile} from "../api/api";
import {Icon} from '@iconify/react';
import deleteOutlineSharp from '@iconify/icons-material-symbols/delete-outline-sharp';


const FilePreview = (props: { courseTag: string, name: string, file: File, changeName: any, uploadFile: boolean, finishedUploading: any, deleteFile: any }) => {
=======
import styles from "@/styles/components/FileUpload.module.scss";
import {uploadFile} from "@/api/course";

const FilePreview = (props: {
    courseTag: string,
    name: string,
    file: File,
    changeName: any,
    uploadFile: boolean,
    finishedUploading: any,
    deleteFile: any
}) => {
>>>>>>> d51fdb0 (major redesign: switch to nextjs, seo improvements)

    const [progress, setProgress] = useState("Ready to upload");
    const [name, setName] = useState(props.name);

    useEffect(() => {
        if (props.uploadFile) {
<<<<<<< HEAD

            setProgress("Uploading 1%")

            uploadFile(name, props.file, props.courseTag, setProgress, props.finishedUploading).catch((error) => {
                setProgress(error.response.data.error);
            });

        }

=======
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
>>>>>>> d51fdb0 (major redesign: switch to nextjs, seo improvements)
    }, [props.uploadFile]);


    return (
<<<<<<< HEAD
        <div className={"file-preview"}>
            <Icon icon={deleteOutlineSharp} className={"remove-file"} onClick={event => {
                props.deleteFile(props.file);
            }}/>
=======
        <div className={styles.filePreview}>
            <div hidden={progress !== "Ready to upload"}>
                <div className={styles.deleteIcon} onClick={() => props.deleteFile(props.file)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 24 24">
                        <path fill="currentColor"
                              d="M5 21V6H4V4h5V3h6v1h5v2h-1v15H5Zm2-2h10V6H7v13Zm2-2h2V8H9v9Zm4 0h2V8h-2v9ZM7 6v13V6Z"/>
                    </svg>
                </div>
            </div>
>>>>>>> d51fdb0 (major redesign: switch to nextjs, seo improvements)
            <input
                type={"text"}
                onChange={event => {
                    setName(event.target.value)
<<<<<<< HEAD
                    //props.changeName(props.file, event.target.value);
                }}
                className={"file-preview-name"} defaultValue={props.name}/>
=======
                }}
                className={styles.filePreviewName} defaultValue={props.name}/>
>>>>>>> d51fdb0 (major redesign: switch to nextjs, seo improvements)
            <p style={{
                alignSelf: "center",
                flexShrink: 0,
                maxWidth: "9rem",
                width: "100%"
            }}>{progress}</p>

        </div>
    )
}

export default FilePreview;