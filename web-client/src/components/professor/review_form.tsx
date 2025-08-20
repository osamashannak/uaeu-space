import {FormEvent, useEffect, useRef, useState} from "react";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import styles from "../../styles/components/professor/review_form.module.scss";
import {ReviewAPI, ReviewFormDraft} from "../../typed/professor.ts";
import {deleteReview, postReview, uploadImageAttachment} from "../../api/professor.ts";
import {convertArabicNumeral} from "../../utils.tsx";
import {LexicalComposer} from "@lexical/react/LexicalComposer";
import {ContentEditable} from "@lexical/react/LexicalContentEditable";
import {HistoryPlugin} from "@lexical/react/LexicalHistoryPlugin";
import {EmojiNode} from "../lexical_editor/emoji_node.ts";
import CustomPlainTextPlugin from "../lexical_editor/custom_plaintext_plugin.tsx";
import {OnChangePlugin} from "@lexical/react/LexicalOnChangePlugin";
import {LexicalEditor} from "lexical";
import {EditorRefPlugin} from "@lexical/react/LexicalEditorRefPlugin";
import ReviewFormFooter from "./review_form_footer.tsx";
import {useDispatch} from "react-redux";
import {addReview} from "../../redux/slice/professor_slice.ts";
import ProgressBar from "progressbar.js";
import Line from "progressbar.js/line";
import EmojiSelector from "../lexical_editor/emoji_selector.tsx";
import ReviewAttachment from "./review_attachment.tsx";
import FlaggedPopup from "./flagged_popup.tsx";

export default function ReviewForm(props: { professorEmail: string; canReview: boolean }) {
    const [details, setDetails] = useState<ReviewFormDraft>({
        score: undefined,
        comment: "",
        positive: undefined,
        attachment: undefined,
    });

    const [submitting, setSubmitting] = useState<boolean | null | "error">(
        !props.canReview ? null : false
    );
    const [flaggedPopup, setFlaggedPopup] = useState<boolean>(false);

    const {executeRecaptcha} = useGoogleReCaptcha();
    const commentRef = useRef<LexicalEditor | null | undefined>(null);
    const dispatch = useDispatch();

    const lineRef = useRef<Line | null>(null);
    const reviewRef = useRef<ReviewAPI | null>(null);

    const attachmentUploadRef = useRef<Promise<string | undefined> | null>(null);

    useEffect(() => {
        if (submitting === true) {
            if (!lineRef.current) {
                lineRef.current = new ProgressBar.Line("#line-container", {
                    color: "#87CEFA",
                    strokeWidth: 0.7,
                });
            }
            lineRef.current.animate(1, {duration: 3000});
        } else {
            lineRef.current?.destroy();
            lineRef.current = null;
        }
    }, [submitting]);

    useEffect(() => {
        const att = details.attachment;
        if (!att) {
            attachmentUploadRef.current = null;
            return;
        }

        if (att.id && att.id !== "READY" && att.id !== "UPLOADING") {
            attachmentUploadRef.current = Promise.resolve(att.id);
            return;
        }

        if (att.id === "READY") {
            setDetails(prev =>
                prev.attachment ? {...prev, attachment: {...prev.attachment, id: "UPLOADING"}} : prev
            );

            attachmentUploadRef.current = uploadImageAttachment(att.src)
                .then((id) => {
                    if (!id) throw new Error("upload failed");
                    setDetails(prev =>
                        prev.attachment ? {...prev, attachment: {...prev.attachment, id}} : prev
                    );
                    return id;
                })
                .catch(() => {
                    setDetails(prev => ({...prev, attachment: undefined}));
                    return undefined;
                });
        }
    }, [details.attachment?.src])

    function formFilled() {
        return (
            ((details.comment && details.comment.trim() && details.comment.length <= 350) ||
                details.attachment) &&
            details.score &&
            details.positive !== undefined
        );
    }

    function invalidRadioSubmission(event: FormEvent<HTMLInputElement>) {
        event.currentTarget.setCustomValidity("Please select one of these options.");
    }

    async function ensureAttachmentUploaded(): Promise<string | undefined> {
        const att = details.attachment;
        if (!att) return undefined;
        if (att.id && att.id !== "UPLOADING") return att.id; // already uploaded
        const p = attachmentUploadRef.current;
        if (!p) return undefined;
        return await p;
    }

    function finalizeSubmission() {
        const review = reviewRef.current;

        if (!review) {
            setSubmitting("error");
            return;
        }

        setSubmitting(null);

        dispatch(
            addReview({
                uaeu_origin: review.uaeu_origin,
                fadeIn: true,
                self: true,
                rated: null,
                reply_count: 0,
                language: review.language,
                attachment: details.attachment,
                author: "User",
                created_at: review.created_at,
                dislike_count: 0,
                like_count: 0,
                text: review.text,
                score: review.score,
                positive: review.positive,
                id: review.id,
                gif: details.gif ? details.gif.url : undefined,
                flagged: true
            })
        );
    }

    function editReview() {
        const review = reviewRef.current;
        if (!review) return;

        (async () => {
            await deleteReview(review.id);
        })()

        reviewRef.current = null;
        setSubmitting(null);
    }

    async function handleSubmit() {
        setSubmitting(true);

        // @ts-expect-error Clarity is not defined
        clarity("set", "ReviewSubmitted", "true");

        window.scrollTo(0, 0);

        if (details.attachment) {
            lineRef.current?.pause();
            const uploadedId = await ensureAttachmentUploaded();
            if (!uploadedId) {
                // @ts-expect-error Clarity is not defined
                clarity("set", "ReviewFailed", "true");
                setSubmitting("error");
                return;
            }
            lineRef.current?.resume();
        }

        if (!executeRecaptcha) {
            // @ts-expect-error Clarity is not defined
            clarity("set", "ReviewFailed", "true");
            setSubmitting("error");
            return;
        }

        const token = await executeRecaptcha("new_review");

        const status = await postReview({
            text: details.comment!,
            score: details.score!,
            positive: details.positive!,
            professor_email: props.professorEmail,
            recaptcha_token: token,
            attachment: details.attachment?.id, // guaranteed uploaded if present
            gif: details.gif ? details.gif.url : undefined,
        });

        if (!status || !status.success) {
            // @ts-expect-error Clarity is not defined
            clarity("set", "ReviewFailed", "true");
            setSubmitting("error");
            return;
        }

        reviewRef.current = status.review;

        if (status.review.flagged) {
            setFlaggedPopup(true);
            return;
        }

        finalizeSubmission();

    }

    if (submitting === null) {
        return (
            <section className={styles.form}>
                <span>You have submitted a review.</span>
            </section>
        );
    }

    if (submitting === "error") {
        return (
            <section className={styles.form}>
                <span>There was an error submitting your review. Please try again later.</span>
            </section>
        );
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
            {flaggedPopup && <FlaggedPopup setShowPopup={setFlaggedPopup} finalizeSubmission={finalizeSubmission}
                                           editReview={editReview}/>}
            <div className={styles.lineContainer}>
                <div id={"line-container"}></div>
            </div>

            <section
                className={styles.reviewForm}
                onClick={event => {
                    event.preventDefault();
                }}
            >
                <LexicalComposer
                    initialConfig={{
                        namespace: "lexical",
                        theme: {
                            rtl: styles.postRTL,
                            ltr: styles.postLTR,
                            paragraph: styles.postParagraph,
                            link: styles.postLink,
                        },
                        editable: !submitting,
                        nodes: [EmojiNode],
                        onError: error => console.log(error),
                    }}
                >
                    <div onClick={() => commentRef.current?.focus()}>
                        <div className={styles.postEditor}>
                            <CustomPlainTextPlugin
                                placeholder={<div className={styles.postPlaceholder}>What was your
                                    experience?</div>}
                                contentEditable={
                                    <div className={styles.postContentContainer}>
                                        <ContentEditable
                                            style={{outline: "none"}}
                                            role={"textbox"}
                                            spellCheck={"true"}
                                            className={styles.postContent}
                                        />
                                    </div>
                                }
                            />
                            <HistoryPlugin/>
                            <EditorRefPlugin editorRef={commentRef}/>
                            <OnChangePlugin
                                onChange={editor => {
                                    const json = editor.toJSON();
                                    let f = "";
                                    // @ts-expect-error LexicalEditor types are not up to date
                                    json.root.children[0].children.forEach(child => {
                                        if (child.type === "linebreak") {
                                            f += "\n";
                                        } else {
                                            f += child.text;
                                        }
                                    });

                                    setDetails(prevDetails => ({
                                        ...prevDetails,
                                        comment: f,
                                    }));
                                }}
                            />
                        </div>

                        <div className={lengthStyle}>
                            <div>
                <span>
                  {[...(details.comment ?? "").trim()].length > 0
                      ? [...details.comment].length
                      : 0}
                </span>
                                <span>/ 350</span>
                            </div>
                        </div>
                    </div>

                    <ReviewAttachment details={details} setDetails={setDetails}/>

                    <EmojiSelector/>
                </LexicalComposer>

                {!submitting && <ReviewFormFooter details={details} setDetails={setDetails}/>}

                <div className={submitting ? styles.disabledFormOptions : styles.formOptions}>
                    <div
                        onClick={event => {
                            event.stopPropagation();
                        }}
                        className={styles.score}
                    >
                        <span className={styles.scoreTitle}>Score: </span>
                        <div
                            className={styles.reviewScoreContainer}
                            onClick={e => {
                                e.stopPropagation();
                                const input = document.getElementById("score-field") as HTMLInputElement;
                                input.focus();
                            }}
                        >
                            <input
                                required
                                maxLength={1}
                                id={"score-field"}
                                inputMode={"numeric"}
                                placeholder={"#"}
                                onChange={event => {
                                    event.target.value = convertArabicNumeral(event.target.value);
                                    if (/[^1-5]/g.test(event.target.value)) {
                                        event.target.setCustomValidity("Enter a number 1-5.");
                                        event.target.value = event.target.value.replace(/[^1-5]/g, "");
                                        details.score = undefined;
                                        setDetails({...details});
                                    } else {
                                        event.target.setCustomValidity("");
                                        details.score = parseInt(event.target.value);
                                        setDetails({...details});
                                    }
                                    event.target.reportValidity();
                                }}
                                type={"text"}
                                className={styles.reviewFormScore}
                            />
                            <span> /5</span>
                        </div>
                    </div>

                    <ul
                        className={styles.reviewFormPositivityList}
                        onClick={event => {
                            event.stopPropagation();
                        }}
                    >
                        <li>
                            <label>
                                <input
                                    required
                                    id={"main-rec-radio"}
                                    onChange={() => {
                                        details.positive = true;
                                        setDetails({...details});
                                    }}
                                    onInvalid={invalidRadioSubmission}
                                    type="radio"
                                    className={styles.radioOne}
                                    name="recommendation"
                                    value="positive"
                                />
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
                                    value="negative"
                                />
                                Do not recommend
                            </label>
                        </li>
                    </ul>
                </div>

                <div className={styles.submitButtonWrapper}>
                    <div
                        title={"Post"}
                        className={
                            submitting
                                ? styles.veryDisabledFormOptions
                                : formFilled()
                                    ? styles.enabledFormSubmit
                                    : styles.disabledFormSubmit
                        }
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
                        }}
                    >
                        <span>Post</span>
                    </div>
                </div>

                <div className={styles.disclaimer} onClick={e => e.stopPropagation()}>
                    This site is protected by reCAPTCHA and the Google{" "}
                    <a href="https://policies.google.com/privacy" target={"_blank"}>
                        Privacy Policy
                    </a>{" "}
                    and{" "}
                    <a href="https://policies.google.com/terms" target={"_blank"}>
                        Terms of Service
                    </a>{" "}
                    apply.
                </div>
            </section>
        </>
    );
}
