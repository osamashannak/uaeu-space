import {useEffect, useState} from "react";
import {uploadFile} from "../api/api";
import {Icon} from '@iconify/react';
import deleteOutlineSharp from '@iconify/icons-material-symbols/delete-outline-sharp';


const FilePreview = (props: { courseTag: string, name: string, file: File, changeName: any, uploadFile: boolean, finishedUploading: any, deleteFile: any }) => {

    const [progress, setProgress] = useState("Ready to upload");

    useEffect(() => {
        if (props.uploadFile) {

            setProgress("Uploading 1%")

            uploadFile(props.name, props.file, props.courseTag, setProgress).catch((error) => {
                setProgress(error.response.data.error)
            }).finally(() => props.finishedUploading(props.file));

            return;
        }

    }, [props.uploadFile]);


    return (
        <div className={"file-preview"}>
            <Icon icon={deleteOutlineSharp} className={"remove-file"} onClick={event => {
                props.deleteFile(props.file);
            }}/>
            <input
                type={"text"}
                onChange={event => {
                    props.changeName(props.file, event.target.value);
                }}
                className={"file-preview-name"} defaultValue={props.name}/>
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