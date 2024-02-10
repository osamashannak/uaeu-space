import styles from "../../styles/components/professor/review_form.module.scss";
import {useLexicalComposerContext} from "@lexical/react/LexicalComposerContext";
import {$insertNodes} from "lexical";
import {$createEmojiNode} from "./emoji_node.tsx";
import {Twemoji} from "../../twemoji";
import Picker from '@emoji-mart/react'
import data from '@emoji-mart/data/sets/14/twitter.json'


export default function EmojiSelector() {
    const [editor] = useLexicalComposerContext();

    let width = 400;

    if (window.innerWidth < 444) {
        width = window.innerWidth - 40;
    }

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
            {/*<EmojiPicker
                height={400}
                width={width}
                previewConfig={{showPreview: false}}
                theme={Theme.LIGHT}
                emojiStyle={EmojiStyle.TWITTER}
                lazyLoadEmojis={true}
                getEmojiUrl={(emoji) => {
                    return ((window.twemoji as Twemoji)).base + "svg/" + emoji + '.svg';
                }}
                onEmojiClick={(emojiData, event) => {
                    editor.update(() => {
                        event.stopPropagation();

                        const twemoji = ((window.twemoji as Twemoji)).parse(emojiData.emoji).match(/src="([^"]*)"/)![1];


                        $insertNodes([$createEmojiNode({emoji: emojiData.emoji, imageUrl: twemoji})])

                        editor.blur();

                    });

                }}
            />*/}
        </div>
    )

}