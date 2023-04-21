import {useEffect, useState} from "react";
import {uploadFile} from "../api/api";
import {Icon} from '@iconify/react';
import deleteOutlineSharp from '@iconify/icons-material-symbols/delete-outline-sharp';


const FilePreview = (props: { courseTag: string, name: string, file: File, changeName: any, uploadFile: boolean, finishedUploading: any, deleteFile: any }) => {

    const [progress, setProgress] = useState("Ready to upload");
    const [name, setName] = useState(props.name);

    useEffect(() => {
        if (props.uploadFile) {

            setProgress("Uploading 1%")

            uploadFile(name, props.file, props.courseTag, setProgress, props.finishedUploading).catch((error) => {
                setProgress(error.response.data.error);
            });

        }

    }, [props.uploadFile]);


    return (
        <div className={"file-preview"}>
            <div hidden={progress !== "Ready to upload"}>
                <Icon icon={deleteOutlineSharp} className={"remove-file"} onClick={event => {
                    props.deleteFile(props.file);
                }}/>
            </div>
            <input
                type={"text"}
                onChange={event => {
                    setName(event.target.value)
                    //props.changeName(props.file, event.target.value);
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