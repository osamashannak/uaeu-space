import styles from "../../styles/components/professor/review_form.module.scss";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {$insertNodes, type LexicalEditor, TextNode} from "lexical";
import {$createEmojiNode, EmojiNode} from "./emoji_node.ts";
import {Twemoji} from "../../twemoji";
import {useEffect} from "react";
import EmojiPicker from "emoji-picker-react";

function findAndTransformEmoji(node: TextNode): null | TextNode {

    const text = node.getTextContent();

    // @ts-expect-error twemoji does not have types
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
        // @ts-expect-error twemoji does not have types
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

function unifiedToEmoji(unified: string) {
    const codePoints = unified.split("-").map(u => parseInt(u, 16));
    return String.fromCodePoint(...codePoints);
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
                        $insertNodes([$createEmojiNode({emoji: emoji.emoji, imageUrl: emoji.imageUrl})]);

                        editor.blur();
                    });
                }}
                getEmojiUrl={unified => {
                    const emoji = unifiedToEmoji(unified)
                    // @ts-expect-error twemoji does not have types
                    return ((window.twemoji as Twemoji)).parse(emoji, {
                        folder: 'svg',
                        ext: '.svg',
                    }).match(/src="([^"]*)"/)![1];
                }}
                lazyLoadEmojis={true}

            />
        </div>
    )

}