import {useEffect, useState} from "react";
import styles from "../../styles/components/professor/review_form.module.scss";
import {uploadImageAttachment, uploadTenorAttachment} from "../../api/professor.ts";
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
import ProgressBar from "progressbar.js";
import Line from "progressbar.js/line";
import AttachmentSlider from "../professor/attachment_slider.tsx";
import ReviewFormFooter from "../professor/review_form_footer.tsx";
import {TimelineFormDraft} from "../../typed/timeline.ts";


export default function TimelinePostForm() {

    const [details, setDetails] = useState<TimelineFormDraft>({
        comment: "",
        attachments: [],
    });
    const [submitting, setSubmitting] = useState<boolean | "error">(false);
    const commentRef = useRef<LexicalEditor | null | undefined>(null);
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

    const handleSubmit = async () => {
        setSubmitting(true);

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

        /*const status = await postReview({
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

        lineRef.current?.destroy();*/
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
                className={styles.timelineForm}
                onClick={event => {
                    event.preventDefault();
                }}>

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
                                placeholder={<div className={styles.postPlaceholder}>What's your question?</div>}
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

                <div className={styles.submitButtonWrapper}>
                    <div title={"Post"}
                         className={submitting ? styles.veryDisabledFormSubmit : formFilled() ? styles.enabledFormSubmit : styles.disabledFormSubmit}
                         onClick={async event => {
                             event.stopPropagation();
                             if (submitting) return;
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
            </section>
        </>
    );
}

