import {ReactComponent as Upload} from "../assests/baseline-upload.svg";
import {useTranslation} from "react-i18next";
import {namespaces} from "../i18n";
import {FormEvent, useState} from "react";
import FilePreview from "./FilePreview";

const FileForm = (props: { courseTag: string }) => {

    const {t, i18n} = useTranslation(namespaces.pages.professor);

    const [details, setDetails] = useState<File[]>([]);
    const [update, setUpdate] = useState<boolean>(false);

    const [submitting, setSubmitting] = useState<boolean>(false);
    const [finished, setFinished] = useState<File[]>([]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitting(true);
    }

    const isFinished = () => {
        return submitting && finished.length === details.length;
    }

    // todo fix this?
    window.onbeforeunload = (e) => {
        if (details.length > 0 && !isFinished()) {
            e.returnValue = "Files are still uploading."
        }
    }

    const finishedUploading = (file: File) => {
        // solves race condition.
        setFinished((prevState) => {
            return [...prevState, file];
        });
    }

    return (
        <form className={"new-review"} onSubmit={handleSubmit}>
            <p><Upload/> Upload Materials</p>
            <fieldset style={{border: "none", padding: 0}}>
                <div className={"file-form-entity"}>
                    <div className={"file-disclaimer"}>Maximum:

                        <ul style={{paddingLeft: "1rem"}}>
                            <li>100 MB per file</li>
                            <li>10 files per upload</li>
                        </ul>
                    </div>
                    <div hidden={submitting}>
                        <span>Upload file(s): </span>
                        <input type={"file"}
                               title={""}
                               hidden
                               className={"file-upload"}
                               id={"file-upload"}
                               multiple
                               onChange={event => {
                                   if (!event.target.files) return;
                                   if (details.length > 9) {
                                       alert("You have reached the maximum of 10 files.")
                                       return;
                                   }
                                   const fileDetails = details.slice();
                                   let i = 0;
                                   const skipped = [];
                                   while (event.target.files.item(i) !== null && fileDetails.length < 10) {
                                       const file = event.target.files.item(i)!;
                                       if (file.size > (100 * 1000 * 1000)) {
                                           skipped.push(file.name);
                                           i++;
                                           continue;
                                       }
                                       fileDetails.push(file);
                                       i++;
                                   }
                                   setDetails(fileDetails);
                                   event.target.files = null;
                                   if (skipped.length > 0) alert("The following files are larger than 100 MB: \n" + skipped.join("\n"));
                               }}/>
                        <label className={"upload-file-button"} htmlFor={"file-upload"}>SELECT FILES</label>
                    </div>
                </div>
                <div>
                    {
                        details.map((value, index) => (
                            <FilePreview file={value} uploadFile={submitting} courseTag={props.courseTag}
                                         finishedUploading={finishedUploading}/>
                        ))
                    }
                </div>

                {
                    isFinished() && (<div style={{marginTop: "3rem", fontWeight: 400}}>
                        Uploaded files will be shown here after being reviewed.
                    </div>)
                }

                <input hidden={submitting} type={"submit"} title={"Upload"} className={"new-review-button"}
                       value={"Upload"}/>

            </fieldset>
        </form>
    )
}

export default FileForm;

