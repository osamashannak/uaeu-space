import {ReactComponent as Upload} from "../assests/baseline-upload.svg";
import {useTranslation} from "react-i18next";
import {namespaces} from "../i18n";
import {FormEvent, useState} from "react";
import {ReactComponent as Loading} from "../assests/bubble-loading.svg";
import {IFile} from "../utils/Course";

const FileForm = (props: { courseTag: string }) => {

    const {t, i18n} = useTranslation(namespaces.pages.professor);

    const [details, setDetails] = useState<IFile[]>([]);

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

    return (
        <form className={"new-review"} onSubmit={handleSubmit}>
            <p><Upload/> Upload Materials</p>
            <fieldset style={{border: "none", padding: 0}}>
                <div>
                    <label>Upload file(s): </label>
                    <input type={"file"}
                           multiple
                           accept=".ppt,.pptx,.pdf,.doc,.docx"
                           onChange={event => {
                               for (let file in event.target.files) {

                               }
                           }}/>
                </div>
                <input type={"submit"} title={"Submit"} className={"new-review-button"}
                       value={t("new_review.submit")!}/>

            </fieldset>
        </form>
    )
}

export default FileForm;

