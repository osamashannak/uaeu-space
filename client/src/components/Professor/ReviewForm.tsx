import {FormEvent, useEffect, useState} from "react";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import styles from "@/styles/components/ReviewForm.module.scss";
import {postReview} from "@/api/professor";
import {ReviewForm} from "@/interface/professor";
import {convertArabicNumeral} from "@/utils";

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

    const clearValidity = () => {
        (document.getElementById("main-rec-radio") as HTMLInputElement).setCustomValidity("");
    }

    const invalidFieldSubmission = (event: any) => {
        event.currentTarget.setCustomValidity("Please fill out this field.");
    }

    const invalidRadioSubmission = (event: any) => {
        event.currentTarget.setCustomValidity("Please select one of these options.");
    }

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setSubmitting(true);

        if (!executeRecaptcha) {
            setSubmitting("error");
            return;
        }

        const token = await executeRecaptcha("new_review");

        await postReview(details, props.professorEmail, token);

        localStorage.setItem(`${props.professorEmail}-prof`, 'true');
        setSubmitting(null);
    }

    if (submitting === null) {
        return (
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
        )
    }

    if (submitting) {
        return (
            <section className={styles.form}>
                <span>Submitting your review...</span>
            </section>
        )
    }

    return (
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
                            onChange={
                                event => {
                                    event.target.value = convertArabicNumeral(event.target.value);
                                    if ((/[^1-5]/g.test(event.target.value))) {
                                        event.target.setCustomValidity("Please enter a number between 1 and 5.");
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
                            className={styles.reviewFormScore}/>
                        <span style={{fontWeight: 400}}> /5</span>
                    </div>

                    <ul className={styles.reviewFormPositivityList}>
                        <li>
                            <label>
                                <input required
                                       id={"main-rec-radio"}
                                       onChange={event => {
                                           event.target.setCustomValidity("")
                                           details.positive = true;
                                           setDetails(details)
                                       }}
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