import {useEffect, useState} from "react";
import {uploadFile} from "../api/api";
import {Icon} from '@iconify/react';
import deleteOutlineSharp from '@iconify/icons-material-symbols/delete-outline-sharp';


const FilePreview = (props: { courseTag: string, file: File, uploadFile: boolean, finishedUploading: any }) => {

    const [name, setName] = useState("");
    const [progress, setProgress] = useState("Ready to upload");

    useEffect(() => {
        if (props.uploadFile) {

            setProgress("Uploading 1%")

            uploadFile(props.file, props.courseTag, setProgress).catch((error) => {
                setProgress(error.response.data.error)
            }).finally(() => props.finishedUploading(props.file));

            return;
        }

        setName(props.file.name);

    }, [props.uploadFile]);


    return (
        <div className={"file-preview"}>
            <Icon icon={deleteOutlineSharp} className={"remove-file"} onClick={event => {

            }}/>
            <input type={"text"} onChange={event => {
                console.log(name)
                setName(event.target.value);
            }} className={"file-preview-name"} defaultValue={name}/>
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