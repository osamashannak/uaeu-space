import {useEffect, useRef, useState} from "react";
import {useGoogleReCaptcha} from "react-google-recaptcha-v3";
import styles from "../../styles/components/professor/review_form.module.scss";
import {ReviewAPI, ReviewFormDraft} from "../../typed/professor.ts";
import {deleteReview, postReview, uploadImageAttachment} from "../../api/professor.ts";
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
import {useModal} from "../provider/modal.tsx";
import FlaggedModal from "../modal/flagged_modal.tsx";
import {Rating} from "react-simple-star-rating";
import StudentVerifyModal from "../modal/student_verify_modal.tsx";

const getStarLabel = (r: number) => {
    if (r === 0) return "";
    if (r <= 2) return "Bad";
    if (r <= 3) return "Okay";
    if (r <= 4) return "Good";
    return "Amazing";
};

export default function ReviewForm(props: { courses: string[], professorEmail: string; canReview: boolean }) {
    const [details, setDetails] = useState<ReviewFormDraft>({
        score: undefined,
        comment: "",
        positive: undefined,
        attachment: undefined,
        course: "",
        grade: "",
    });

    const [submitting, setSubmitting] = useState<boolean | null | "error">(
        !props.canReview ? null : false
    );
    const [showCourseMenu, setShowCourseMenu] = useState(false);
    const [mode, setMode] = useState<"GUEST" | "VERIFIED">(localStorage.getItem("is_verified_student") === "true" ? "VERIFIED" : "GUEST");
    const {executeRecaptcha} = useGoogleReCaptcha();
    const [courseError, setCourseError] = useState(false);
    const commentRef = useRef<LexicalEditor | null | undefined>(null);
    const dispatch = useDispatch();
    const comboboxRef = useRef<HTMLDivElement>(null);
    const lineRef = useRef<Line | null>(null);
    const reviewRef = useRef<ReviewAPI | null>(null);

    const attachmentUploadRef = useRef<Promise<string | undefined> | null>(null);

    const modal = useModal();

    const filteredCourses = props.courses.filter(c =>
        c.toLowerCase().includes(details.course.toLowerCase())
    );

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (comboboxRef.current && !comboboxRef.current.contains(event.target as Node)) {
                setShowCourseMenu(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        const handleStorageChange = () => {
            const isVerified = localStorage.getItem("is_verified_student") === "true";
            if (isVerified && mode === 'GUEST') {
                setMode('VERIFIED');
            }
        };

        window.addEventListener("storage", handleStorageChange);
        return () => window.removeEventListener("storage", handleStorageChange);
    }, [mode]);

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
                text: review.text ?? "",
                score: review.score,
                grade: review.grade,
                course: review.course,
                positive: review.positive,
                id: review.id,
                gif: details.gif ? details.gif.url : undefined,
                flagged: true,
                verified: review.verified
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
        setSubmitting(false);
    }

    async function handleSubmit() {
        if (props.professorEmail.endsWith('@uaeu.ac.ae')) {
            if (!details.course || !props.courses.includes(details.course)) {
                setCourseError(true);
                comboboxRef.current?.scrollIntoView({behavior: 'smooth', block: 'center'});
                return;
            }
        }

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

        const review = await postReview({
            text: details.comment!,
            score: details.score!,
            positive: details.positive!,
            professor_email: props.professorEmail,
            recaptcha_token: token,
            attachment: details.attachment?.id, // guaranteed uploaded if present
            gif: details.gif ? details.gif.url : undefined,
            course: details.course,
            grade: details.grade,
        });

        if (!review) {
            // @ts-expect-error Clarity is not defined
            clarity("set", "ReviewFailed", "true");
            setSubmitting("error");
            return;
        }

        reviewRef.current = review;

        if (review.flagged) {
            modal.openModal(FlaggedModal, {
                finalizeSubmission: finalizeSubmission,
                editReview: editReview,
            });
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
            <div className={styles.lineContainer}>
                <div id={"line-container"}></div>
            </div>

            <section
                className={styles.reviewForm}
                onClick={event => {
                    event.preventDefault();
                }}
            >


                {!submitting && props.professorEmail.endsWith('@uaeu.ac.ae') && <>
                    {

                        mode === "GUEST" ?  <div className={styles.privacyNotice} onClick={(e) => {
                            e.stopPropagation();
                            modal.openModal(StudentVerifyModal, {
                                mode,
                                setMode
                            })
                        }}><svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 24 24">
                            <path fill="currentColor"
                                  d="M11 7h2v2h-2zm0 4h2v6h-2zm1-9C6.48 2 2 6.48 2 12s4.48 10 10 10s10-4.48 10-10S17.52 2 12 2m0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8s8 3.59 8 8s-3.59 8-8 8"/>
                        </svg>
                            <span>Your student status isn't verified. <u>Click here to verify.</u></span>
                        </div> : <div className={styles.verifiedBadge}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="1.1em" height="1.1em" viewBox="0 0 24 24"><path fill="currentColor" d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2m-8.29 13.29a.996.996 0 0 1-1.41 0L5.71 12.7a.996.996 0 1 1 1.41-1.41L10 14.17l6.88-6.88a.996.996 0 1 1 1.41 1.41z"/></svg>
                            <span>Your student status is verified.</span>
                        </div>

                    }
                </>}

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
                                <span>/350</span>
                            </div>
                        </div>
                    </div>

                    <ReviewAttachment details={details} setDetails={setDetails}/>

                    <EmojiSelector/>
                </LexicalComposer>

                {!submitting && <ReviewFormFooter details={details} setDetails={setDetails}/>}


                {!submitting &&
                    <div className={styles.inputField}>
                        <div className={styles.inputTitle}>
                            Overall rating
                        </div>
                        <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                            <Rating
                                onClick={(rate) => setDetails(prev => ({...prev, score: rate}))}
                                size={32}
                                transition={true}
                                fillColor="#049AE5"
                                emptyColor="#E5E5E5"
                            />
                            <span style={{fontSize: '14px', fontWeight: 600, color: '#049AE5'}}>
                                {getStarLabel(details.score || 0)}
                            </span>
                        </div>
                    </div>
                }

                {props.professorEmail.endsWith('@uaeu.ac.ae') && !submitting && <div className={styles.courseDetails}>
                    <div ref={comboboxRef} className={styles.comboboxWrapper}>
                        <label className={styles.inputTitle}>Course taken</label>
                        <input
                            type="text"
                            className={styles.comboboxInput}
                            placeholder="e.g. ACCT 1101"
                            value={details.course}
                            onChange={(e) => {
                                setDetails(prev => ({...prev, course: e.target.value.toUpperCase()}));
                                setShowCourseMenu(true);
                            }}
                            onFocus={() => setShowCourseMenu(true)}
                        />

                        {courseError && (
                            <div className={styles.errorMessage}>Please select a course.</div>
                        )}

                        {showCourseMenu && (
                            <div className={styles.comboboxMenu}>
                                {filteredCourses.length > 0 ? (
                                    filteredCourses.map((c) => (
                                        <div
                                            key={c}
                                            className={styles.comboboxItem}
                                            onClick={() => {
                                                setDetails(prev => ({...prev, course: c}));
                                                setShowCourseMenu(false);
                                            }}
                                        >
                                            {c}
                                        </div>
                                    ))
                                ) : (
                                    <div className={styles.noResults}>
                                        No matches.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <div className={styles.inputField}>
                        <label className={styles.inputTitle}>Grade received (optional)</label>
                        <div className={styles.selectContainer}>
                            <select className={styles.nativeSelect} value={details.grade}
                                    onChange={(e) => {
                                        setDetails(prev => ({...prev, grade: e.target.value}));
                                    }}>
                                <option value=""></option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                                <option value="F">F</option>
                            </select>
                        </div>
                    </div>
                </div>}

                <div className={styles.inputField}>
                    <label className={styles.inputTitle}>Would you recommend?</label>

                    <div className={styles.recommendGroup}>
                        <button
                            type="button" // Prevent form submission
                            onClick={() => setDetails(prev => ({...prev, positive: true}))}
                            className={details.positive === true ? styles.btnYesActive : styles.recommendBtn}
                        >
                            <span>👍</span> Yes
                        </button>

                        <button
                            type="button"
                            onClick={() => setDetails(prev => ({...prev, positive: false}))}
                            className={details.positive === false ? styles.btnNoActive : styles.recommendBtn}
                        >
                            <span>👎</span> No
                        </button>
                    </div>
                </div>


                <div className={styles.submitButtonWrapper}>
                    <div
                        title={"Post"}
                        className={
                            submitting
                                ? styles.veryDisabledFormSubmit
                                : formFilled()
                                    ? styles.enabledFormSubmit
                                    : styles.disabledFormSubmit
                        }
                        onClick={async event => {
                            event.stopPropagation();
                            if (submitting || !props.canReview) return;
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
