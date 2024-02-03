import {useState} from "react";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import styles from "../../styles/components/professor/review_form.module.scss";
import {ReviewFormDraft} from "../../typed/professor.ts";
import {postReview} from "../../api/professor.ts";
import {convertArabicNumeral} from "../../utils.tsx";
import {Link} from "react-router-dom";
import {LexicalComposer} from "@lexical/react/LexicalComposer";
import {ContentEditable} from "@lexical/react/LexicalContentEditable";
import {HistoryPlugin} from "@lexical/react/LexicalHistoryPlugin";
import {EmojiNode} from "../lexical_editor/emoji_node.tsx";
import CustomPlainTextPlugin from "../lexical_editor/custom_plaintext_plugin.tsx";
import EmojiSelector from "../lexical_editor/emoji_selector.tsx";
import {OnChangePlugin} from "@lexical/react/LexicalOnChangePlugin";
import {LexicalEditor} from "lexical";
import {EditorRefPlugin} from "@lexical/react/LexicalEditorRefPlugin";
import {useRef} from "react";
import ReviewFormFooter from "./review_form_footer.tsx";

export default function ReviewForm(props: { professorEmail: string }) {

    const [details, setDetails] = useState<ReviewFormDraft>({
        score: undefined,
        comment: "",
        positive: undefined,
        attachments: [],
    });
    const [submitting, setSubmitting] = useState<boolean | null | "error" | "loading">(localStorage.getItem(`${props.professorEmail}-prof`) ? null : false);
    const {executeRecaptcha} = useGoogleReCaptcha();
    const commentRef = useRef<LexicalEditor | null | undefined>(null);

    const formFilled = () => {
        return (
            (details.comment
                && details.comment.trim()
                && details.comment.length <= 350 || details.attachments.length > 0) &&
            details.score &&
            details.positive !== undefined);
    }

    const invalidRadioSubmission = (event: any) => {
        event.currentTarget.setCustomValidity("Please select one of these options.");
    }

    const handleSubmit = async () => {
        setSubmitting(true);

        const uploadingAttachmentsCount = details.attachments.filter(attachment => attachment.id === "UPLOADING").length;

        if (uploadingAttachmentsCount > 0) {
            setTimeout(handleSubmit, 500);
            return;
        }

        if (!executeRecaptcha) {
            setSubmitting("error");
            return;
        }

        const token = await executeRecaptcha("new_review");

        const status = await postReview({
            comment: details.comment!,
            score: details.score!,
            positive: details.positive!,
            professorEmail: props.professorEmail,
            recaptchaToken: token,
            attachments: details.attachments.map((attachment) => attachment.id)
        });

        if (!status) {
            setSubmitting("error");
            return;
        }

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

    let lengthStyle = styles.commentLength;


    if ((details.comment ?? "").trim()) {

        const length = (details.comment ?? "").trim().length;

        if (length > 350) {
            lengthStyle += ` ${styles.commentLengthWarning}`;
        } else if (length === 350) {
            lengthStyle += ` ${styles.commentLengthPerfect}`;
        } else if (length < 350) {
            lengthStyle += ` ${styles.commentLengthGood}`;
        }

    }


    return (

        <section
            className={styles.form}
            onClick={event => {
                event.preventDefault();
            }}>

            <div>
                <div className={styles.guestWarning} onClick={(e) => {
                    e.stopPropagation();

                    const warningWindow = document.querySelector(`.${styles.fullscreenWarning}`) as HTMLDivElement;
                    warningWindow.style.display = "flex";
                    document.body.style.overflow = "hidden";
                    document.body.style.height = `calc(100vh - 160px)`;
                }}>
                    <span>You are not logged in</span>
                    <div className={styles.infoButton}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
                            <path fill="currentColor"
                                  d="M11 17h2v-6h-2zm1-8q.425 0 .713-.288T13 8q0-.425-.288-.712T12 7q-.425 0-.712.288T11 8q0 .425.288.713T12 9m0 13q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22m0-2q3.35 0 5.675-2.325T20 12q0-3.35-2.325-5.675T12 4Q8.65 4 6.325 6.325T4 12q0 3.35 2.325 5.675T12 20m0-8"/>
                        </svg>
                    </div>
                </div>

                <div className={styles.fullscreenWarning} onClick={(e) => {
                    e.stopPropagation();
                    const warningWindow = document.querySelector(`.${styles.fullscreenWarning}`) as HTMLDivElement;
                    warningWindow.style.display = "none";
                    document.body.style.overflow = "auto";
                    document.body.style.height = "auto";
                }}>
                    <div className={styles.warningWindow} onClick={(e) => {
                        e.stopPropagation();
                    }}>
                        <h3>Logging in will allow you to:</h3>
                        <div className={styles.list}>
                            <p className={styles.element}>1. Edit your reviews 12 hours after submitting</p>
                            <p className={styles.element}>2. Delete your reviews at any time</p>
                        </div>
                        <h5>Your reviews will always be anonymous</h5>
                        <Link className={styles.warningButton} to={"/login"}>Login</Link>
                    </div>

                </div>
            </div>


            <LexicalComposer initialConfig={{
                namespace: 'lexical',
                theme: {
                    rtl: styles.postRTL,
                    ltr: styles.postLTR,
                    paragraph: styles.postParagraph,
                },
                nodes: [EmojiNode],
                onError: (error) => console.log(error),
            }}>

                <div onClick={() => commentRef.current?.focus()}>
                    <div className={styles.postEditor}>
                        <CustomPlainTextPlugin
                            placeholder={<div className={styles.postPlaceholder}>What was your experience?</div>}
                            contentEditable={
                                <div className={styles.postContentContainer}>
                                    <ContentEditable style={{outline: "none"}} role={"textbox"} spellCheck={"true"}
                                                     className={styles.postContent}/>
                                </div>
                            }
                        />
                        <HistoryPlugin/>
                        <EditorRefPlugin editorRef={commentRef}/>
                        <OnChangePlugin onChange={(editor) => {

                            const json = editor.toJSON();

                            let f = "";

                            json.root.children[0].children.forEach((child) => {
                                if (child.type === "linebreak") {
                                    f += "\n";
                                } else {
                                    f += child.text;
                                }
                            });

                            setDetails((prevDetails) => ({
                                ...prevDetails,
                                comment: f,
                            }));


                        }}/>
                    </div>


                    <div className={lengthStyle}>
                        <div>
                            <span>{(details.comment ?? "").trim().length > 0 ? details.comment?.length : 0}</span>
                            <span>/ 350</span>
                        </div>
                    </div>
                </div>

                {details.attachments && <div className={styles.imagesPreviewList}>
                    {details.attachments.map((attachment, index) => {

                        if ('videoSrc' in attachment) {


                            return (

                                <div key={attachment.id + index} className={styles.videoPreview}
                                     style={{
                                         width: 1/attachment.aspectRatio * 680 + "px",
                                     }}
                                     onClick={event => {
                                         event.stopPropagation();
                                     }}>
                                    <div className={styles.deleteButton}
                                         onClick={(event) => {
                                             event.stopPropagation();
                                             setDetails((prevDetails) => ({
                                                 ...prevDetails,
                                                 attachments: prevDetails.attachments?.filter((_) =>  _.url !== attachment.url),
                                             }));
                                             URL.revokeObjectURL(attachment.url);
                                         }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             viewBox="0 0 256 256">
                                            <path fill="currentColor"
                                                  d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128L50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z"/>
                                        </svg>
                                    </div>
                                    <div style={{paddingBottom: `${attachment.aspectRatio * 100}%`}}></div>
                                    <div className={styles.videoDiv}>
                                        <video autoPlay loop controls playsInline muted>
                                            <source src={attachment.url} type={attachment.videoSrc.type}/>
                                        </video>
                                    </div>
                                </div>

                            );
                        }

                        return (
                            <>
                                <div key={attachment.aspectRatio + index} className={styles.imagePreview}
                                     onClick={event => {
                                         event.stopPropagation();
                                         window.open(attachment.url, '_blank');
                                     }}>
                                    <div className={styles.deleteButton}
                                         onClick={(event) => {
                                             event.stopPropagation();
                                             setDetails((prevDetails) => ({
                                                 ...prevDetails,
                                                 attachments: prevDetails.attachments?.filter((_) => _.url !== attachment.url),
                                             }));
                                             URL.revokeObjectURL(attachment.url);
                                         }}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
                                             viewBox="0 0 256 256">
                                            <path fill="currentColor"
                                                  d="M205.66 194.34a8 8 0 0 1-11.32 11.32L128 139.31l-66.34 66.35a8 8 0 0 1-11.32-11.32L116.69 128L50.34 61.66a8 8 0 0 1 11.32-11.32L128 116.69l66.34-66.35a8 8 0 0 1 11.32 11.32L139.31 128Z"/>
                                        </svg>
                                    </div>
                                    <div style={{paddingBottom: `${attachment.aspectRatio * 100}%`}}></div>
                                    <div style={{backgroundImage: `url(${attachment.url})`}}
                                         className={styles.imageDiv}>
                                    </div>
                                    <img src={attachment.url}
                                         draggable={false}
                                         width={100}
                                         height={100}
                                         alt={""}/>
                                </div>
                                <div>
                                    {attachment.id.includes("tenor") &&
                                        <span>Via Tenor</span>
                                    }
                                </div>
                            </>
                        )
                    })}
                </div>}
                <EmojiSelector/>
            </LexicalComposer>

            <ReviewFormFooter details={details} setDetails={setDetails}/>


            <div className={styles.formOptions}>
                <div
                    onClick={event => {
                        event.stopPropagation();
                    }}
                    className={styles.score}>
                    <span>Score: </span>
                    <input
                        required maxLength={1}
                        id={"score-field"}
                        inputMode={"numeric"}
                        placeholder={"#"}
                        onChange={
                            event => {
                                event.target.value = convertArabicNumeral(event.target.value);
                                if ((/[^1-5]/g.test(event.target.value))) {
                                    event.target.setCustomValidity("Enter a number 1-5.");
                                    event.target.value = event.target.value.replace(/[^1-5]/g, '')
                                    details.score = undefined;
                                    setDetails({...details});
                                } else {
                                    event.target.setCustomValidity("");
                                    details.score = parseInt(event.target.value);
                                    setDetails({...details});
                                }
                                event.target.reportValidity();
                            }
                        }
                        type={"text"}
                        className={styles.reviewFormScore}/>
                    <span> /5</span>
                </div>

                <ul className={styles.reviewFormPositivityList}
                    onClick={event => {
                        event.stopPropagation();
                    }}>
                    <li>
                        <label>
                            <input required
                                   id={"main-rec-radio"}
                                   onChange={() => {
                                       details.positive = true;
                                       setDetails({...details});
                                   }}
                                   onInvalid={invalidRadioSubmission}
                                   type="radio"
                                   className={styles.radioOne}
                                   name="recommendation"
                                   value="positive"/>
                            Recommend
                        </label>
                    </li>
                    <li>
                        <label>
                            <input
                                onChange={() => {
                                    details.positive = false;
                                    setDetails({...details});
                                }}
                                type="radio"
                                className={styles.radioTwo}
                                name="recommendation"
                                value="negative"/>
                            Not recommended
                        </label>
                    </li>
                </ul>
            </div>

            <input type={"submit"}
                   title={"Submit"}
                   className={formFilled() ? styles.enabledFormSubmit : styles.disabledFormSubmit}
                   value={"Submit"}
                   onClick={async event => {
                       event.stopPropagation();
                       if (!formFilled()) {
                           const invalidFields = Array.from(document.querySelectorAll("input:invalid"));
                           const score = invalidFields.find(field => field.id === "score-field");

                           if (score) {
                               // @ts-ignore
                               score.reportValidity();
                               return;
                           }

                           if (invalidFields.length > 1) {
                               // @ts-ignore
                               invalidFields[0].reportValidity();
                           }

                           return;
                       }
                       await handleSubmit();
                   }}/>

            <div className={styles.disclaimer}>
                This site is protected by reCAPTCHA and the Google <a
                href="https://policies.google.com/privacy" target={"_blank"}>Privacy Policy</a> and <a
                href="https://policies.google.com/terms" target={"_blank"}>Terms of Service</a> apply.
            </div>
        </section>
    );
}

