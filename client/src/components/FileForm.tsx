import {ReactComponent as Upload} from "../assests/baseline-upload.svg";
import {useTranslation} from "react-i18next";
import {namespaces} from "../i18n";
import {FormEvent, useState} from "react";
import {ReactComponent as Loading} from "../assests/bubble-loading.svg";

const FileForm = (props: { courseTag: string }) => {

    const {t, i18n} = useTranslation(namespaces.pages.professor);

    const [details, setDetails] = useState<File[]>([]);
    const [update, setUpdate] = useState<boolean>(false);

    const [submitting, setSubmitting] = useState<boolean | null>(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitting(true);

        /*const apiRes = await postFile(details, props.courseTag);
        if (!apiRes) {
            setSubmitting(false);
            return;
        }*/
        setSubmitting(null);

        localStorage.setItem(`${props.courseTag}-course`, 'true');
    }

    if (submitting === null) {
        return (
            <div style={{marginTop: "3rem", fontWeight: 400}}>
                Files uploaded to the website!<br/>They will be published here after review.
            </div>
        )
    }

    if (submitting) {
        return (
            <div style={{marginTop: "3rem", fontWeight: 400}}>
                Uploading materials... <Loading/>
            </div>
        )
    }

    window.onbeforeunload = (e) => {
        if (details.length > 0) {
            e.returnValue = "Files are still uploading."
        }
    }


    return (
        <form className={"new-review"} onSubmit={handleSubmit}>
            <p><Upload/> Upload Materials</p>
            <fieldset style={{border: "none", padding: 0}}>
                <div className={"file-form-entity"}>
                    <p className={"file-disclaimer"}>Maximum:

                        <ul style={{paddingLeft: "1rem"}}>
                            <li>500 MB per file</li>
                            <li>8 files per upload</li>
                        </ul>
                    </p>
                    <span>Upload file(s): </span>
                    <input type={"file"}
                           title={""}
                           hidden
                           className={"file-upload"}
                           id={"file-upload"}
                           multiple
                           onChange={event => {
                               if (!event.target.files || details.length > 7) return;
                               const fileDetails = details.slice();
                               let i = 0;
                               while (event.target.files.item(i) !== null && fileDetails.length < 8) {
                                   fileDetails.push(event.target.files.item(i)!);
                                   i++;
                               }
                               setDetails(fileDetails);
                               event.target.files = null;
                           }}/>
                    <label className={"upload-file-button"} htmlFor={"file-upload"}>SELECT FILES</label>
                </div>
                <div>
                    {
                        details.map((value, index) => (
                            <div key={index} className={"file-preview"}>
                                <input type={"text"} defaultValue={value.name}/>
                            </div>
                        ))
                    }
                </div>
                <input type={"submit"} title={"Submit"} className={"new-review-button"}
                       value={t("new_review.submit")!}/>

            </fieldset>
        </form>
    )
}

export default FileForm;

