import styles from "../../styles/components/professor/review_form.module.scss";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {$insertNodes, type LexicalEditor, TextNode} from "lexical";
import {$createEmojiNode, EmojiNode} from "./emoji_node.ts";
import type {Twemoji} from "../../twemoji";
import {useEffect} from "react";
import EmojiPicker from "emoji-picker-react";
import {getTwemojiSvgUrl} from "../../twemoji_config.ts";

type TwemojiWindow = Window & typeof globalThis & {
    twemoji?: Twemoji;
};

const getTwemoji = () => {
    if (typeof window === "undefined") return undefined;

    return (window as TwemojiWindow).twemoji;
}

function findAndTransformEmoji(node: TextNode): null | TextNode {

    const text = node.getTextContent();
    const twemoji = getTwemoji();

    if (!twemoji?.test(text)) {
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
    const imageUrl = twemoji.parse(emoji.emoji).match(/src="([^"]*)"/)?.[1];

    if (!imageUrl) {
        return null;
    }

    let targetNode;

    if (emoji.firstIndex === 0) {
        [targetNode] = node.splitText(emoji.lastIndex);
    } else {
        [, targetNode] = node.splitText(emoji.firstIndex, emoji.lastIndex);
    }

    const emojiNode = $createEmojiNode({
        emoji: emoji.emoji,
        imageUrl
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
            <EmojiPicker
                onEmojiClick={(emoji) => {
                    editor.update(() => {
                        $insertNodes([$createEmojiNode({
                            emoji: emoji.emoji,
                            imageUrl: getTwemojiSvgUrl(emoji.unified)
                        })]);

                        editor.blur();
                    });
                }}
                getEmojiUrl={getTwemojiSvgUrl}
                lazyLoadEmojis={true}

            />
        </div>
    )

}
