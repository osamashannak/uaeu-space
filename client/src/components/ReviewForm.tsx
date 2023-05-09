import {useTranslation} from "react-i18next";
import {namespaces} from "../i18n";
import {FormEvent, useEffect, useState} from "react";
import {IReview, IReviewForm} from "../utils/Professor";
import {Icon} from '@iconify/react';
import bubbleLoading from '@iconify/icons-eos-icons/bubble-loading';
import {postReview} from "../api/api";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import {getProfileFromSession} from "../utils/Global";

const a2e = (s: any) => s.replace(/[٠-٩]/g, (d: any) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))

const ReviewForm = (props: { email: string }) => {

    const {t, i18n} = useTranslation(namespaces.pages.professor);
    const [details, setDetails] = useState<IReviewForm>({
        author: "Anonymous",
        score: 1,
        comment: "",
        positive: false
    });
    const [submitting, setSubmitting] = useState<boolean | null>(false);
    const {executeRecaptcha} = useGoogleReCaptcha();

    const clearValidity = () => {
        (document.getElementById("main-rec-radio") as HTMLInputElement).setCustomValidity("");
    }

    const invalidFieldSubmission = (event: any) => {
        event.currentTarget.setCustomValidity(t("new_review.error.missing"));
    }

    const invalidRadioSubmission = (event: any) => {
        event.currentTarget.setCustomValidity(t("new_review.error.not_selected"));
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitting(true);

        const clientKey = localStorage.getItem(`clientKey`)!;
        const token = await executeRecaptcha!("new_review");

        await postReview(details, props.email, token, clientKey);

        setSubmitting(null);
    }

    if (submitting === null) {
        return (
            <div className={"new-review submitted"}>
                {t("new_review.status.submitted")}
            </div>
        )
    }

    if (submitting) {
        return (
            <div className={"new-review submitted"}>
                {t("new_review.status.submitting")} <Icon icon={bubbleLoading}/>
            </div>
        )
    }

    return (
        <form className={"new-review"} onSubmit={handleSubmit}>
            <p>{t("new_review.title")}</p>
            <fieldset style={{border: "none", padding: 0}}>
                <div>
                    <input maxLength={15}
                           className={"new-review-field"}
                           onChange={(event) => {
                               details.author = event.target.value;
                               setDetails(details)
                           }}
                           placeholder={t("new_review.name")!}/>
                </div>
                <textarea required maxLength={350}
                          onInvalid={invalidFieldSubmission}
                          onChange={event => {
                              details.comment = event.target.value;
                              setDetails(details)
                              event.target.setCustomValidity("")
                          }}
                          className={"new-review-field new-review-comment"}
                          placeholder={t("new_review.comment")!}/>
                <div className={"no-nsfw-warning"}>
                    <p>{t("warning.line1")}</p>
                </div>
                <div>
                    <div className={"new-review-score"}>
                        <label>{t("new_review.score")}: </label>
                        <input
                            required maxLength={1}
                            inputMode={"numeric"}
                            placeholder={"#"}
                            onChange={
                                event => {
                                    event.target.value = a2e(event.target.value);
                                    if ((/[^1-5]/g.test(event.target.value))) {
                                        event.target.setCustomValidity(t("new_review.error.incorrect_number"));
                                        event.target.value = event.target.value.replace(/[^1-5]/g, '')
                                    } else {
                                        event.target.setCustomValidity("");
                                        details.score = parseInt(event.target.value);
                                        setDetails(details)
                                    }
                                    event.target.reportValidity();
                                }
                            }
                            type={"text"}
                            className={"score-field"}/><span style={{fontWeight: 400}}> /5</span>
                    </div>
                    <div>
                        <div>
                            <label className={"rec-radio-label"}>
                                <input required
                                       id={"main-rec-radio"}
                                       onChange={event => {
                                           event.target.setCustomValidity("")
                                           details.positive = true;
                                           setDetails(details)
                                       }}
                                       onInvalid={invalidRadioSubmission} type="radio" className={"rec-radio"}
                                       name="recommendation"
                                       value="positive"/>
                                {t("new_review.positive")}
                            </label>
                        </div>
                        <label className={"rec-radio-label"}>
                            <input
                                onChange={event => {
                                    clearValidity();
                                    details.positive = false;
                                    setDetails(details)
                                }}
                                type="radio"
                                className={"rec-radio"}
                                name="recommendation"
                                value="negative"/>
                            {t("new_review.negative")}
                        </label>
                    </div>
                    <input type={"submit"}
                           title={"Submit"}
                           className={"new-review-button"}
                           value={t("new_review.submit")!}/>
                </div>
            </fieldset>
        </form>
    )
}

export default ReviewForm

