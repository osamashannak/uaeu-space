import {ReactComponent as Upload} from "../assests/baseline-upload.svg";
import {useTranslation} from "react-i18next";
import {namespaces} from "../i18n";
import {FormEvent, useState} from "react";
import FilePreview from "./FilePreview";

const FileForm = (props: { courseTag: string }) => {

    const {t} = useTranslation(namespaces.pages.course);

    const [details, setDetails] = useState<{ name: string, file: File }[]>([]);

    const [submitting, setSubmitting] = useState<boolean>(false);
    const [finished, setFinished] = useState<File[]>([]);

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (details.length < 1) {
            alert(t("errors.no_files"));
            return;
        }
        setSubmitting(true);
    }

    const changeName = (file: File, name: string) => {

        details.find(value => value.file === file)!.name = name;
        console.log(details)
        setDetails((prevState) => {
            const tempState = [...prevState]
            tempState.find(value => value.file === file)!.name = name;
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

    const isFinished = () => {
        return submitting && finished.length === details.length;
    }

    window.onbeforeunload = (e) => {
        if (details.length > 0 && !isFinished()) {

            // todo if left before finish delete file from multer
            return t("errors.still_uploading");
        }
    }


    return (
        <form className={"new-review"} onSubmit={handleSubmit}>
            <p><Upload/> {t("upload_materials")}</p>
            <fieldset style={{border: "none", padding: 0}}>
                <div className={"file-form-entity"}>
                    <div className={"file-disclaimer"}>
                        {t("disclaimer.maximum")}:
                        <ul style={{paddingLeft: "1rem", paddingRight: "1rem"}}>
                            <li>{t("disclaimer.size")}</li>
                            <li>{t("disclaimer.amount")}</li>
                        </ul>
                    </div>
                    <div hidden={submitting}>
                        <span>{t("upload_files")}: </span>
                        <input type={"file"}
                               title={""}
                               className={"file-upload"}
                               id={"file-upload"}
                               multiple
                               onChange={event => {
                                   if (!event.target.files) return;
                                   if (details.length > 9) {
                                       alert(t("errors.reached_amount"))
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

                                       fileDetails.push({
                                           name: file.name,
                                           file: file
                                       });
                                       i++;
                                   }

                                   setDetails(fileDetails);
                                   event.target.files = null;
                                   if (skipped.length > 0) alert(t("errors.over_size") + "\n" + skipped.join("\n"));
                               }}/>
                        <label className={"upload-file-button"} htmlFor={"file-upload"}>{t("select_files")}</label>
                    </div>
                </div>
                <div>
                    {
                        details.map((value, index) => {
                            return <FilePreview key={`${value.name}-${index}`} file={value.file} name={value.name}
                                                uploadFile={submitting}
                                                courseTag={props.courseTag}
                                                finishedUploading={finishedUploading} changeName={changeName}
                                                deleteFile={deleteFile}/>
                        })
                    }
                </div>

                {
                    isFinished() && (<div style={{marginTop: "3rem", fontWeight: 400}}>
                        {t("thank_you")}<br/>{t("confirmation")}
                    </div>)
                }

                <input hidden={submitting} type={"submit"} title={t("submit")!} className={"new-review-button"}
                       value={t("submit")!}/>

            </fieldset>
        </form>
    )
}

export default FileForm;

