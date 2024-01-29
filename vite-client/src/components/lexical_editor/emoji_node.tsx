/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {EditorConfig, LexicalNode, NodeKey, SerializedTextNode, Spread,} from 'lexical';
import {TextNode} from 'lexical';

export type SerializedEmojiNode = Spread<
    {
        emojiUrl: string,
        emojiText: string,
    },
    SerializedTextNode
>;

export class EmojiNode extends TextNode {
    __emojiURL: string;
    __emojiText: string;

    static getType(): string {
        return 'emoji';
    }

    static clone(node: EmojiNode): EmojiNode {
        return new EmojiNode(node.__emojiURL, node.__emojiText, node.__key);
    }

    constructor(url: string, text: string, key?: NodeKey) {
        super(text, key);
        this.__emojiText = text;
        this.__emojiURL = url;
    }

    createDOM(config: EditorConfig): HTMLElement {
        const dom = document.createElement('span');

        dom.style.backgroundImage = `url(${this.__emojiURL})`;
        dom.style.backgroundSize = '20px';
        dom.style.backgroundRepeat = 'no-repeat';
        dom.style.backgroundPosition = 'center center';
        dom.style.setProperty('-webkit-text-fill-color', 'transparent');

        const inner = super.createDOM(config);
        dom.appendChild(inner);
        return dom;
    }

    updateDOM(
        prevNode: TextNode,
        dom: HTMLElement,
        config: EditorConfig,
    ): boolean {
        const inner = dom.firstChild;
        if (inner === null) {
            return true;
        }
        super.updateDOM(prevNode, inner as HTMLElement, config);
        return false;
    }

    static importJSON(serializedNode: SerializedEmojiNode): EmojiNode {
        const node = $createEmojiNode({
            imageUrl: serializedNode.emojiUrl,
            emoji: serializedNode.emojiText,
        });
        node.setFormat(serializedNode.format);
        node.setDetail(serializedNode.detail);
        node.setMode(serializedNode.mode);
        node.setStyle(serializedNode.style);
        return node;
    }

    exportJSON(): SerializedEmojiNode {
        return {
            ...super.exportJSON(),
            emojiText: this.__emojiText,
            emojiUrl: this.__emojiURL,
            type: 'emoji'
        };
    }
}

export function $isEmojiNode(
    node: LexicalNode | null | undefined,
): node is EmojiNode {
    return node instanceof EmojiNode;
}

export function $createEmojiNode(
    emojiData: { imageUrl: string, emoji: string },
): EmojiNode {
    return new EmojiNode(emojiData.imageUrl, emojiData.emoji).setMode('token');
}