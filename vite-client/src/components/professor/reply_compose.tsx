import styles from "../../styles/components/professor/reply_compose.module.scss";
import reviewStyles from "../../styles/components/professor/review.module.scss";
import {EmojiNode} from "../lexical_editor/emoji_node.tsx";
import CustomPlainTextPlugin from "../lexical_editor/custom_plaintext_plugin.tsx";
import {ContentEditable} from "@lexical/react/LexicalContentEditable";
import {HistoryPlugin} from "@lexical/react/LexicalHistoryPlugin";
import {EditorRefPlugin} from "@lexical/react/LexicalEditorRefPlugin";
import {OnChangePlugin} from "@lexical/react/LexicalOnChangePlugin";
import {LexicalComposer} from "@lexical/react/LexicalComposer";
import {useEffect, useRef, useState} from "react";
import {LexicalEditor} from "lexical";
import dayjs from "dayjs";
import {formatRelativeTime} from "../../utils.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import {getReplyName, postReply} from "../../api/professor.ts";


interface ReviewComposeProps {
    id: number;
    reviewId: number;
    author: string;
    comment: string;
    mention?: string;
    created_at: Date;
    showReplyCompose: (show: boolean) => void;
}


export default function ReplyCompose(props: ReviewComposeProps) {

    const [comment, setComment] = useState("");
    const commentRef = useRef<LexicalEditor | null | undefined>(null);
    const [submitting, setSubmitting] = useState(false);
    const [name, setName] = useState<string | null>(null);


    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handlePopState = (e) => {
            navigate(location.pathname, {replace: true});
            props.showReplyCompose(false);
        }

        window.addEventListener("popstate", (e) => {
            e.preventDefault();
            handlePopState(e);
        });

        return () => {
            window.removeEventListener("popstate", handlePopState);
        }

    }, [location.pathname, navigate, props]);


    useEffect(() => {
        const body = document.querySelector("body") as HTMLBodyElement;
        body.style.maxHeight = "100vh";
        body.style.overflow = "hidden";

        const html = document.querySelector("html") as HTMLHtmlElement;
        html.style.overscrollBehaviorY = "none";

        return () => {
            body.style.removeProperty("max-height");
            body.style.removeProperty("overflow");
            const html = document.querySelector("html") as HTMLHtmlElement;
            html.style.overscrollBehaviorY = "auto";
        }

    }, []);

    useEffect(() => {
        getReplyName(props.reviewId).then((n) => {
            setName(n);
        });
    }, [props.reviewId]);

    let lengthStyle = styles.commentLength;

    if (comment.length > 350) {
        lengthStyle += ` ${styles.commentLengthWarning}`;
    } else if (comment.length == 350) {
        lengthStyle += ` ${styles.commentLengthPerfect}`;
    } else if (comment.length < 350) {
        lengthStyle += ` ${styles.commentLengthGood}`;
    }

    const formFilled = () => {
        return comment.trim().length > 0;
    }

    const handleSubmit = async () => {
        setSubmitting(true);

        postReply(props.reviewId, comment, props.mention).then((response) => {
            if (response) {
                window.location.reload();
            }
        });

    }

    if (!name) {
        return (
            <div className={styles.replyForm}>
                <svg xmlns="http://www.w3.org/2000/svg" width="64px" height="64px" viewBox="0 0 24 24">
                    <rect width="24" height="24" fill="none"/>
                    <path fill="currentColor"
                          d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z"
                          opacity="0.5"/>
                    <path fill="currentColor" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z">
                        <animateTransform attributeName="transform" dur="1s" from="0 12 12" repeatCount="indefinite"
                                          to="360 12 12" type="rotate"/>
                    </path>
                </svg>
            </div>
        )
    }

    return (
        <div className={styles.replyForm} onClick={(e) => {
            e.stopPropagation();
            props.showReplyCompose(false);
        }}>
            <div className={styles.replyFormModal} onClick={(e) => e.stopPropagation()}>
                <div className={styles.closeButton} onClick={() => props.showReplyCompose(false)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                        <rect width="24" height="24" fill="none"/>
                        <path fill="currentColor"
                              d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6z"/>
                    </svg>
                </div>

                <div className={reviewStyles.reply}>
                    <div className={reviewStyles.replyAuthor}>
                        <span>{props.author}</span>
                        <div className={"text-separator"}>
                            <span>·</span>
                        </div>
                        <time
                            dateTime={props.created_at.toString()}
                            title={dayjs(props.created_at).format("MMM D, YYYY h:mm A")}
                            className={reviewStyles.time}
                        >{formatRelativeTime(new Date(props.created_at))}</time>
                    </div>
                    <div>
                        <p dir={"auto"} className={reviewStyles.replyText}>{props.mention &&
                            <span className={reviewStyles.mention}>@{props.mention} </span>}{props.comment}</p>
                    </div>
                </div>
                <div className={styles.replyingTo}>
                    <span>Replying as <span className={reviewStyles.replyAuthor}>{name}</span> to @{props.author}</span>
                </div>
                <LexicalComposer initialConfig={{
                    namespace: 'lexical',
                    theme: {
                        rtl: styles.postRTL,
                        ltr: styles.postLTR,
                        paragraph: styles.postParagraph,
                        link: styles.postLink
                    },
                    nodes: [EmojiNode],
                    onError: (error) => console.log(error),
                }}>

                    <div>
                        <div className={styles.postEditor}>
                            <CustomPlainTextPlugin
                                placeholder={<div className={styles.postPlaceholder}>Write a reply</div>}
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

                                setComment(f);
                            }}/>
                        </div>


                        <div className={lengthStyle}>
                            <div>
                                <span>{[...(comment ?? "").trim()].length > 0 ? [...comment].length : 0}</span>
                                <span>/ 350</span>
                            </div>
                        </div>
                    </div>
                </LexicalComposer>

                <div className={styles.submitButtonWrapper}>
                    <div title={"Post"}
                         className={submitting ? styles.veryDisabledFormSubmit : formFilled() ? styles.enabledFormSubmit : styles.disabledFormSubmit}
                         onClick={async event => {
                             event.stopPropagation();
                             await handleSubmit();
                         }}>
                        <span>Post</span>
                    </div>
                </div>
            </div>
        </div>
    )
}