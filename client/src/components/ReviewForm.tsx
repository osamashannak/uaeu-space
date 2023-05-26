<<<<<<< HEAD
import {useTranslation} from "react-i18next";
import {namespaces} from "../i18n";
import {FormEvent, useEffect, useState} from "react";
import {IReview} from "../utils/Professor";
import {Icon} from '@iconify/react';
import bubbleLoading from '@iconify/icons-eos-icons/bubble-loading';
import writeIcon from '@iconify/icons-icon-park-outline/write';
import {postReview} from "../api/api";

const a2e = (s: any) => s.replace(/[٠-٩]/g, (d: any) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))

const ReviewForm = (props: { email: string }) => {

    const {t, i18n} = useTranslation(namespaces.pages.professor);

    const [details, setDetails] = useState<IReview>({
        id: 0,
        author: "Anonymous",
        score: 1,
        comment: "",
        positive: false,
        created_at: Date.now().toString()
    });

    const [submitting, setSubmitting] = useState<boolean | null>(false);

    useEffect(() => {
        const hasSubmittedBefore = localStorage.getItem(`${props.email}-prof`);
        setSubmitting(hasSubmittedBefore ? null : false);
    }, []);
=======
import {FormEvent, useEffect, useState} from "react";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import styles from "@/styles/components/ReviewForm.module.scss";
import {postReview} from "@/api/professor";
import {ReviewForm} from "@/interface/professor";

const a2e = (s: any) => s.replace(/[٠-٩]/g, (d: any) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))

const ReviewForm = (props: { professorEmail: string }) => {

    const [details, setDetails] = useState<ReviewForm>({
        author: "Anonymous",
        score: 1,
        comment: "",
        positive: false
    });
    const [submitting, setSubmitting] = useState<boolean | null | "error" | "loading">("loading");
    const {executeRecaptcha} = useGoogleReCaptcha();
    
    useEffect(() => {
        const hasSubmittedBefore = localStorage.getItem(`${props.professorEmail}-prof`);
        setSubmitting(hasSubmittedBefore ? null : false);
    }, [props.professorEmail]);
>>>>>>> d51fdb0 (major redesign: switch to nextjs, seo improvements)

    const clearValidity = () => {
        (document.getElementById("main-rec-radio") as HTMLInputElement).setCustomValidity("");
    }

    const invalidFieldSubmission = (event: any) => {
<<<<<<< HEAD
        event.currentTarget.setCustomValidity(t("new_review.error.missing"));
    }

    const invalidRadioSubmission = (event: any) => {
        event.currentTarget.setCustomValidity(t("new_review.error.not_selected"));
=======
        event.currentTarget.setCustomValidity("Please fill out this field.");
    }

    const invalidRadioSubmission = (event: any) => {
        event.currentTarget.setCustomValidity("Please select one of these options.");
>>>>>>> d51fdb0 (major redesign: switch to nextjs, seo improvements)
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitting(true);

<<<<<<< HEAD
        const apiRes = await postReview(details, props.email);
        if (!apiRes) {
            setSubmitting(false);
            return;
        }
        setSubmitting(null);
        localStorage.setItem(`${props.email}-prof`, 'true');
        window.location.reload();
=======
        if (!executeRecaptcha) {
            setSubmitting("error");
            return;
        }

        const token = await executeRecaptcha("new_review");

        await postReview(details, props.professorEmail, token);

        localStorage.setItem(`${props.professorEmail}-prof`, 'true');
        setSubmitting(null);
>>>>>>> d51fdb0 (major redesign: switch to nextjs, seo improvements)
    }

    if (submitting === null) {
        return (
<<<<<<< HEAD
            <div style={{marginTop: "3rem", fontWeight: 400}}>
                {t("new_review.status.submitted")}
            </div>
=======
            <section className={styles.form}>
                <span>You have submitted a review.</span>
            </section>
        )
    }

    if (submitting === "error") {
        return (
            <section className={styles.form}>
                <span>There was an error submitting your review. Please try again later.</span>
            </section>
        )
    }

    if (submitting === "loading") {
        return (
            <section className={styles.form}>
                <span>Loading...</span>
            </section>
>>>>>>> d51fdb0 (major redesign: switch to nextjs, seo improvements)
        )
    }

    if (submitting) {
        return (
<<<<<<< HEAD
            <div style={{marginTop: "3rem", fontWeight: 400}}>
                {t("new_review.status.submitted")} <Icon icon={bubbleLoading}/>
            </div>
=======
            <section className={styles.form}>
                <span>Submitting your review...</span>
            </section>
>>>>>>> d51fdb0 (major redesign: switch to nextjs, seo improvements)
        )
    }

    return (
<<<<<<< HEAD
        <form className={"new-review"} onSubmit={handleSubmit}>
            <p><Icon icon={writeIcon}/> {t("new_review.title")}</p>
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
                <div style={{color: 'darkred', fontWeight: 400, fontSize: "0.8rem"}}>
                    <p>{t("warning.line1")}</p>
                    <p>{t("warning.line2")}</p>
                </div>
                <div>
                    <div className={"new-review-score"}>
                        <label>{t("new_review.score")}: </label>
                        <input
                            required maxLength={1}
                            inputMode={"numeric"}
=======
        <section className={styles.form}>
            <h2>Write a Comment</h2>
            <form onSubmit={handleSubmit}>
                <fieldset style={{border: "none", padding: 0}}>

                    <div>
                        <input maxLength={15}
                               className={styles.reviewFormField}
                               onChange={(event) => {
                                   details.author = event.target.value;
                                   setDetails(details)
                               }}
                               placeholder={"Name (Optional)"}/>
                    </div>

                    <textarea required maxLength={350}
                              onInvalid={invalidFieldSubmission}
                              onChange={event => {
                                  details.comment = event.target.value;
                                  setDetails(details)
                                  event.target.setCustomValidity("")
                              }}
                              className={styles.reviewFormComment}
                              placeholder={"Comment (max. 350)"}/>

                    <div className={styles.noNSFWWarning}>
                        <p>Keep your comment polite and respectful.</p>
                    </div>

                    <div className={"new-review-score"}>
                        <label>Score: </label>
                        <input
                            required maxLength={1}
                            inputMode={"numeric"}
                            placeholder={"#"}
>>>>>>> d51fdb0 (major redesign: switch to nextjs, seo improvements)
                            onChange={
                                event => {
                                    event.target.value = a2e(event.target.value);
                                    if ((/[^1-5]/g.test(event.target.value))) {
<<<<<<< HEAD
                                        event.target.setCustomValidity(t("new_review.error.incorrect_number"));
=======
                                        event.target.setCustomValidity("Please enter a number between 1 and 5.");
>>>>>>> d51fdb0 (major redesign: switch to nextjs, seo improvements)
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
<<<<<<< HEAD
                            className={"score-field"}/><span style={{fontWeight: 400}}> /5</span>
                    </div>
                    <div>
                        <div>
                            <label className={"rec-radio-label"}>
=======
                            className={styles.reviewFormScore}/>
                        <span style={{fontWeight: 400}}> /5</span>
                    </div>

                    <ul className={styles.reviewFormPositivityList}>
                        <li>
                            <label>
>>>>>>> d51fdb0 (major redesign: switch to nextjs, seo improvements)
                                <input required
                                       id={"main-rec-radio"}
                                       onChange={event => {
                                           event.target.setCustomValidity("")
                                           details.positive = true;
                                           setDetails(details)
                                       }}
<<<<<<< HEAD
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
                    <input type={"submit"} title={"Submit"} className={"new-review-button"}
                           value={t("new_review.submit")!}/>
                </div>
            </fieldset>
        </form>
    )
}

export default ReviewForm

=======
                                       onInvalid={invalidRadioSubmission}
                                       type="radio"
                                       className={styles.reviewFormRadio}
                                       name="recommendation"
                                       value="positive"/>
                                Recommend
                            </label>
                        </li>
                        <li>
                            <label>
                                <input
                                    onChange={event => {
                                        clearValidity();
                                        details.positive = false;
                                        setDetails(details)
                                    }}
                                    type="radio"
                                    className={styles.reviewFormRadio}
                                    name="recommendation"
                                    value="negative"/>
                                Not recommended
                            </label>
                        </li>
                    </ul>

                    <input type={"submit"}
                           title={"Submit"}
                           className={styles.formSubmit}
                           value={"Submit"}/>

                    <div className={styles.disclaimer}>
                        By submitting this review, you agree to the <a href={"/terms-of-service"} target={"_blank"}>Terms of
                        Service</a> and <a href={"/privacy"} target={"_blank"}>Privacy Policy</a>.
                        <br/>
                        This site is protected by reCAPTCHA and the Google <a
                        href="https://policies.google.com/privacy" target={"_blank"}>Privacy Policy</a> and <a
                        href="https://policies.google.com/terms" target={"_blank"}>Terms of Service</a> apply.
                    </div>
                </fieldset>
            </form>
        </section>
    );
}

export default ReviewForm;
>>>>>>> d51fdb0 (major redesign: switch to nextjs, seo improvements)
