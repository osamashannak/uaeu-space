import styles from "../../styles/pages/post.module.scss";
import formStyles from "../../styles/components/professor/review_form.module.scss";
import {LexicalComposer} from "@lexical/react/LexicalComposer";
import {EmojiNode} from "../lexical_editor/emoji_node.tsx";
import {useRef, useState} from "react";
import CustomPlainTextPlugin from "../lexical_editor/custom_plaintext_plugin.tsx";
import {ContentEditable} from "@lexical/react/LexicalContentEditable";
import {HistoryPlugin} from "@lexical/react/LexicalHistoryPlugin";
import {EditorRefPlugin} from "@lexical/react/LexicalEditorRefPlugin";
import {OnChangePlugin} from "@lexical/react/LexicalOnChangePlugin";
import {LexicalEditor} from "lexical";

export default function ReplyField() {

    const [submitting, setSubmitting] = useState(false);
    const [details, setDetails] = useState({
        comment: "",
    });
    const commentRef = useRef<LexicalEditor | null | undefined>(null);

    let lengthStyle = formStyles.commentLength;

    if (details.comment && details.comment.length > 350) {
        lengthStyle += ` ${formStyles.commentLengthWarning}`;
    } else if (details.comment && details.comment.length == 350) {
        lengthStyle += ` ${formStyles.commentLengthPerfect}`;
    } else if (details.comment && details.comment.length < 350) {
        lengthStyle += ` ${formStyles.commentLengthGood}`;
    }


    return (
        <div className={styles.replyField}>
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
                            placeholder={<div className={formStyles.postPlaceholder}>Answer the question</div>}
                            contentEditable={
                                <div className={formStyles.postContentContainer}>
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
            </LexicalComposer>
        </div>
    )
}