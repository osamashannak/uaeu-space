import {ChangeEvent, FormEvent, useState} from "react";
import styles from "@/styles/components/FileUpload.module.scss";
import FilePreview from "@/components/Course/FilePreview";

const FileUpload = (props: { courseTag: string }) => {
    const [details, setDetails] = useState<{name: string, file: File}[]>([]);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [finished, setFinished] = useState<File[]>([]);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (details.length < 1) {
            alert("You need to select files to upload first.");
            return;
        }
        setSubmitting(true);
    }

    const changeName = (file: File, name: string) => {
        setDetails((prevState) => {
            const tempState = [...prevState];
            const index = tempState.findIndex(value => value.file === file);
            tempState[index].name = name;
            return tempState;
        });
    }

    const deleteFile = (file: File) => {
        setDetails((prevState) => {
            const tempState = [...prevState]
            return tempState.filter(value => value.file !== file);
        });
    }


    const finishedUploading = (file: File) => {
        setFinished((prevState) => {
            return [...prevState, file];
        });
    }

    const onFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
        if (!event.target.files) return;

        if (details.length > 9) {
            alert("You have reached the maximum of 10 files.");
            return;
        }

        const fileDetails = details.slice();
        let i = 0;
        const skipped = [];

        while (event.target.files.item(i) && fileDetails.length < 10) {
            const file = event.target.files.item(i)!;

            if (file.size > (100 * 1024 * 1024)) {
                skipped.push(file.name);
                i++;
                continue;
            }

            if (fileDetails.find(value => value.name === file.name)) {
                fileDetails.push({
                    name: `${Math.round(Math.random() * 1E4)}-${file.name}`,
                    file: file
                });
            } else {
                fileDetails.push({
                    name: file.name,
                    file: file
                });
            }

            i++;
        }

        setDetails(fileDetails);

        // @ts-ignore
        event.target.value = null;

        if (skipped.length > 0) alert("The following files are larger than 100 MB:" + "\n" + skipped.join("\n"));
    }

    const isFinished = () => {
        return submitting && details.length > 0 && finished.length === details.length;
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h2>Upload Materials</h2>
            <fieldset style={{border: "none", padding: 0}}>

                <div className={styles.formField} hidden={submitting}>
                    <span>Upload file(s): </span>
                    <input type={"file"}
                           title={""}
                           className={styles.uploadButtonHTML}
                           id={"file-upload"}
                           multiple
                           onChange={onFileSelect}/>
                    <label className={styles.uploadButtonLabel} htmlFor={"file-upload"}>SELECT FILES</label>
                </div>

                <div className={styles.limits}>
                    <em>Maximum:
                    <ul>
                        <li>100 MB per file</li>
                        <li>10 files per upload</li>
                    </ul></em>
                </div>

                <div>
                    {
                        details.map((value, index) => {
                            return <FilePreview key={`${value.name}`} file={value.file} name={value.name}
                                                uploadFile={submitting}
                                                courseTag={props.courseTag}
                                                finishedUploading={finishedUploading}
                                                changeName={changeName}
                                                deleteFile={deleteFile}/>
                        })
                    }
                </div>

                {
                    isFinished() && (<div style={{marginTop: "3rem", fontWeight: 400}}>
                        Thank you.<br/>Uploaded files will be shown here after being reviewed.
                    </div>)
                }

                <input hidden={submitting} type={"submit"} title={"Submit"} className={details.length> 0 ? styles.enabledFormSubmit : styles.disabledFormSubmit}
                       value={"Submit"}/>

                <div className={styles.disclaimer}>
                    By uploading files, you agree to the <a href={"/terms-of-service"} target={"_blank"}>Terms of Service</a> and <a href={"/privacy"} target={"_blank"}>Privacy Policy</a>.
                </div>

            </fieldset>
        </form>
    )
}

export default FileUpload;