import styles from "../../styles/components/professor/review_form.module.scss";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {$insertNodes, type LexicalEditor, TextNode} from "lexical";
import {$createEmojiNode, EmojiNode} from "./emoji_node.tsx";
import {Twemoji} from "../../twemoji";
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data/sets/14/twitter.json'
import {useEffect} from "react";

function findAndTransformEmoji(node: TextNode): null | TextNode {
    const text = node.getTextContent();

    const unparsedEmojiExists = ((window.twemoji as Twemoji)).test(text);

    if (!unparsedEmojiExists) {
        return null;
    }

    const emojiRegex = /\p{Emoji}/ug;
    const match = emojiRegex.exec(text);

    if (match === null) {
        return null;
    }

    const emoji = {
        emoji: match[0],
        firstIndex: match.index,
        lastIndex: match.index + match[0].length
    }

    let targetNode;

    if (emoji.firstIndex === 0) {
        [targetNode] = node.splitText(emoji.lastIndex);
    } else {
        [, targetNode] = node.splitText(emoji.firstIndex, emoji.lastIndex);
    }

    const emojiNode = $createEmojiNode({
        emoji: emoji.emoji,
        imageUrl: ((window.twemoji as Twemoji)).parse(emoji.emoji).match(/src="([^"]*)"/)![1]
    });

    targetNode.replace(emojiNode);

    return emojiNode;
}

function textNodeTransform(node: TextNode): void {
    let targetNode: TextNode | null = node;

    while (targetNode !== null) {
        if (!targetNode.isSimpleText()) {
            return;
        }

        targetNode = findAndTransformEmoji(targetNode);
    }
}

function useEmojis(editor: LexicalEditor): void {
    useEffect(() => {
        if (!editor.hasNodes([EmojiNode])) {
            throw new Error('EmojisPlugin: EmojiNode not registered on editor');
        }

        return editor.registerNodeTransform(TextNode, textNodeTransform);
    }, [editor]);
}

export default function EmojiSelector() {
    const [editor] = useLexicalComposerContext();

    useEmojis(editor);

    return (
        <div className={styles.emojiSelector} onClick={(e) => {
            e.stopPropagation();
        }}>
            <Picker
                data={data}
                theme={"light"}
                previewPosition={"none"}
                set={"twitter"}
                onClickOutside={() => {
                    const emojiPicker = document.querySelector(styles.emojiSelector) as HTMLDivElement;
                    if (emojiPicker) {
                        emojiPicker.style.opacity = "0";
                        emojiPicker.style.pointerEvents = "none";
                    }
                }}
                onEmojiSelect={(emoji: { native: string; }) => {
                    editor.update(() => {
                        const twemoji = ((window.twemoji as Twemoji)).parse(emoji.native).match(/src="([^"]*)"/)![1];

                        $insertNodes([$createEmojiNode({emoji: emoji.native, imageUrl: twemoji})])

                        editor.blur();
                    });
                }}
            />
        </div>
    )

}