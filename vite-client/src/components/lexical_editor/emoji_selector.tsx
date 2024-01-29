import styles from "../../styles/components/professor/review_form.module.scss";
import EmojiPicker, {EmojiStyle, Theme} from "emoji-picker-react";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {$insertNodes} from "lexical";
import {$createEmojiNode} from "./emoji_node.tsx";


export default function EmojiSelector() {
    const [editor] = useLexicalComposerContext();

    return (
        <div className={styles.emojiSelector} onClick={(e) => {
            e.stopPropagation();
        }}>
            <EmojiPicker
                height={400}
                width={400}
                previewConfig={{showPreview: false}}
                theme={Theme.LIGHT}
                emojiStyle={EmojiStyle.TWITTER}
                onEmojiClick={(emojiData, event) => {
                    editor.update(() => {
                        event.stopPropagation();

                        $insertNodes([$createEmojiNode({emoji: emojiData.emoji, imageUrl: emojiData.imageUrl})])

                        editor.blur();

                    });

                }}
            />
        </div>
    )

}