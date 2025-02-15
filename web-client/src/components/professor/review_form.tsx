import {FormEvent, useEffect, useState} from "react";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import styles from "../../styles/components/professor/review_form.module.scss";
import {ReviewFormDraft} from "../../typed/professor.ts";
import {postReview, uploadImageAttachment, uploadTenorAttachment} from "../../api/professor.ts";
import {convertArabicNumeral} from "../../utils.tsx";
import {LexicalComposer} from "@lexical/react/LexicalComposer";
import {ContentEditable} from "@lexical/react/LexicalContentEditable";
import {HistoryPlugin} from "@lexical/react/LexicalHistoryPlugin";
import {EmojiNode} from "../lexical_editor/emoji_node.ts";
import CustomPlainTextPlugin from "../lexical_editor/custom_plaintext_plugin.tsx";
import {OnChangePlugin} from "@lexical/react/LexicalOnChangePlugin";
import {LexicalEditor} from "lexical";
import {EditorRefPlugin} from "@lexical/react/LexicalEditorRefPlugin";
import {useRef} from "react";
import ReviewFormFooter from "./review_form_footer.tsx";
import AttachmentSlider from "./attachment_slider.tsx";
import {useDispatch} from "react-redux";
import {addReview} from "../../redux/slice/professor_slice.ts";
import ProgressBar from "progressbar.js";
import Line from "progressbar.js/line";
import EmojiSelector from "../lexical_editor/emoji_selector.tsx";


export default function ReviewForm(props: { professorEmail: string, canReview: boolean }) {

    const [details, setDetails] = useState<ReviewFormDraft>({
        score: undefined,
        comment: "",
        positive: undefined,
        attachments: [],
    });
    const [submitting, setSubmitting] = useState<boolean | null | "error">(!props.canReview ? null : false);
    const {executeRecaptcha} = useGoogleReCaptcha();
    const commentRef = useRef<LexicalEditor | null | undefined>(null);
    const dispatch = useDispatch();
    const lineRef = useRef<Line | null>(null);

    useEffect(() => {
        function verifyUpload(id: string | undefined, url: string) {
            if (id === undefined) {
                alert("Failed to upload the media file.");
                setDetails((prevDetails) => ({
                    ...prevDetails,
                    attachments: prevDetails.attachments.filter((_) => _.url !== url),
                }));
                return;
            }

            console.log(details.attachments)

            const index = details.attachments.findIndex(attachment => attachment.url === url);

            details.attachments[index].id = id;

            setDetails(prevState => {
                return {
                    ...prevState,
                    attachments: details.attachments,
                }
            })
        }

        const attachments = details.attachments.filter(attachment => attachment.id === "READY");

        for (const attachment of attachments) {
            if ('src' in attachment) {
                setDetails((prevDetails) => ({
                    ...prevDetails,
                    attachments: prevDetails.attachments.map((_) => {
                        if (_.url === attachment.url) {
                            return {
                                ..._,
                                id: "UPLOADING",
                            }
                        }
                        return _;
                    }),
                }));
                uploadImageAttachment(attachment.src).then(id => {
                    verifyUpload(id, attachment.url);
                })
            } else {
                setDetails((prevDetails) => ({
                    ...prevDetails,
                    attachments: prevDetails.attachments.map((_) => {
                        if (_.url === attachment.url) {
                            return {
                                ..._,
                                id: "UPLOADING",
                            }
                        }
                        return _;
                    }),
                }));
                uploadTenorAttachment(attachment).then(id => {
                    verifyUpload(id, attachment.url);
                });
            }
        }

    }, [details.attachments]);

    useEffect(() => {
        if (submitting === null || submitting === "error") {
            return;
        }

        lineRef.current = new ProgressBar.Line('#line-container', {
            color: '#87CEFA',
            strokeWidth: 0.7,

        });
    }, [submitting]);

    const formFilled = () => {
        return (
            (details.comment
                && details.comment.trim()
                && details.comment.length <= 350 || details.attachments.length > 0) &&
            details.score &&
            details.positive !== undefined);
    }

    const invalidRadioSubmission = (event: FormEvent<HTMLInputElement>) => {
        event.currentTarget.setCustomValidity("Please select one of these options.");
    }

    const handleSubmit = async () => {
        setSubmitting(true);

        // @ts-expect-error Clarity is not defined
        clarity("set", "ReviewSubmitted", "true");

        window.scrollTo(0, 0);

        lineRef.current!.animate(1, {
            duration: 3000,
        });

        await new Promise((resolve) => setTimeout(resolve, 1000));

        const uploadingAttachmentsCount = details.attachments.filter(attachment => attachment.id === "UPLOADING").length;

        if (uploadingAttachmentsCount > 0) {
            setTimeout(handleSubmit, 500);
            return;
        }

        if (!executeRecaptcha) {
            // @ts-expect-error Clarity is not defined
            clarity("set", "ReviewFailed", "true");
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

        if (!status || !status.success) {
            // @ts-expect-error Clarity is not defined
            clarity("set", "ReviewFailed", "true");
            setSubmitting("error");
            return;
        }

        setSubmitting(null);

        dispatch(addReview({
            uaeuOrigin: status.review.uaeuOrigin,
            fadeIn: true,
            self: true,
            selfRating: null,
            comments: 0,
            attachments: details.attachments,
            author: "User",
            created_at: status.review.created_at,
            dislikes: 0,
            likes: 0,
            comment: status.review.comment,
            score: status.review.score,
            positive: status.review.positive,
            id: status.review.id
        }));

        lineRef.current?.destroy();
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

    let lengthStyle = styles.commentLength;

    if (details.comment && details.comment.length > 350) {
        lengthStyle += ` ${styles.commentLengthWarning}`;
    } else if (details.comment && details.comment.length == 350) {
        lengthStyle += ` ${styles.commentLengthPerfect}`;
    } else if (details.comment && details.comment.length < 350) {
        lengthStyle += ` ${styles.commentLengthGood}`;
    }

    return (

        <>
            <div className={styles.lineContainer}>
                <div id={"line-container"}></div>
            </div>
            <section
                className={styles.reviewForm}
                onClick={event => {
                    event.preventDefault();
                }}>

                {/*<div>
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
                        document.body.style.removeProperty("overflow");
                        document.body.style.removeProperty("height");
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
                            <Link className={styles.warningButton} onClick={() => {
                                const warningWindow = document.querySelector(`.${styles.fullscreenWarning}`) as HTMLDivElement;
                                warningWindow.style.display = "none";
                                document.body.style.removeProperty("overflow");
                                document.body.style.removeProperty("height");
                            }} to={"/login"}>Login</Link>
                        </div>

                    </div>
                </div>*/}


                <LexicalComposer initialConfig={{
                    namespace: 'lexical',
                    theme: {
                        rtl: styles.postRTL,
                        ltr: styles.postLTR,
                        paragraph: styles.postParagraph,
                        link: styles.postLink
                    },
                    editable: !submitting,
                    nodes: [EmojiNode],
                    onError: (error) => console.log(error),
                }}>

                    <div onClick={() => commentRef.current?.focus()}>
                        <div className={styles.postEditor}>
                            <CustomPlainTextPlugin
                                placeholder={<div className={styles.postPlaceholder}>What was your
                                    experience?</div>}
                                contentEditable={
                                    <div className={styles.postContentContainer}>
                                        <ContentEditable style={{outline: "none"}} role={"textbox"}
                                                         spellCheck={"true"}
                                                         className={styles.postContent}/>
                                    </div>
                                }
                            />
                            <HistoryPlugin/>
                            <EditorRefPlugin editorRef={commentRef}/>
                            <OnChangePlugin onChange={(editor) => {
                                const json = editor.toJSON();

                                let f = "";

                                // @ts-expect-error LexicalEditor types are not up to date
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
                                <span>{[...(details.comment ?? "").trim()].length > 0 ? [...details.comment].length : 0}</span>
                                <span>/ 350</span>
                            </div>
                        </div>
                    </div>

                    <AttachmentSlider details={details} setDetails={setDetails}/>

                    <EmojiSelector/>
                </LexicalComposer>

                {!submitting && <ReviewFormFooter details={details} setDetails={setDetails}/>}

                <div className={submitting ? styles.disabledFormOptions : styles.formOptions}>
                    <div
                        onClick={event => {
                            event.stopPropagation();
                        }}
                        className={styles.score}>
                        <span className={styles.scoreTitle}>Score: </span>
                        <div className={styles.reviewScoreContainer} onClick={(e) => {
                            e.stopPropagation();
                            const input = document.getElementById("score-field") as HTMLInputElement;
                            input.focus();
                        }}>
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
                                Do not recommend
                            </label>
                        </li>
                    </ul>
                </div>

                <div className={styles.submitButtonWrapper}>
                    <div title={"Post"}
                         className={submitting ? styles.veryDisabledFormSubmit : formFilled() ? styles.enabledFormSubmit : styles.disabledFormSubmit}
                         onClick={async event => {
                             event.stopPropagation();
                             if (submitting || !props.canReview) return;
                             if (!formFilled()) {
                                 const invalidFields = Array.from(document.querySelectorAll("input:invalid"));
                                 const score = invalidFields.find(field => field.id === "score-field");

                                 if (score) {
                                     // @ts-expect-error types are not up-to-date
                                     score.reportValidity();
                                     return;
                                 }

                                 if (invalidFields.length > 1) {
                                     // @ts-expect-error types are not up-to-date
                                     invalidFields[0].reportValidity();
                                 }

                                 return;
                             }
                             await handleSubmit();
                         }}>
                        <span>Post</span>
                    </div>
                </div>

                <div className={styles.disclaimer} onClick={e => e.stopPropagation()}>
                    This site is protected by reCAPTCHA and the Google <a
                    href="https://policies.google.com/privacy" target={"_blank"}>Privacy Policy</a> and <a
                    href="https://policies.google.com/terms" target={"_blank"}>Terms of Service</a> apply.
                </div>
            </section>
        </>
    );
}

