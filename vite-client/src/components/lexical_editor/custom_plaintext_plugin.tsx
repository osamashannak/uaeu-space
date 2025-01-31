/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import useLexicalEditable from '@lexical/react/useLexicalEditable';
import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {LexicalEditor} from "lexical";
import {registerDragonSupport} from '@lexical/dragon';
import {registerPlainText} from '@lexical/plain-text';
import {mergeRegister} from '@lexical/utils';
import {useLayoutEffect, useState} from "react";
import {$canShowPlaceholderCurry} from '@lexical/text';

function usePlainTextSetup(editor: LexicalEditor): void {
    useLayoutEffect(() => {
        return mergeRegister(
            registerPlainText(editor),
            registerDragonSupport(editor),
        );
    }, [editor]);
}

function canShowPlaceholderFromCurrentEditorState(
    editor: LexicalEditor,
): boolean {
    return editor
        .getEditorState()
        .read($canShowPlaceholderCurry(editor.isComposing()));
}

function useCanShowPlaceholder(editor: LexicalEditor): boolean {
    const [canShowPlaceholder, setCanShowPlaceholder] = useState(() =>
        canShowPlaceholderFromCurrentEditorState(editor),
    );

    useLayoutEffect(() => {
        function resetCanShowPlaceholder() {
            const currentCanShowPlaceholder =
                canShowPlaceholderFromCurrentEditorState(editor);
            setCanShowPlaceholder(currentCanShowPlaceholder);
        }
        resetCanShowPlaceholder();
        return mergeRegister(
            editor.registerUpdateListener(() => {
                resetCanShowPlaceholder();
            }),
            editor.registerEditableListener(() => {
                resetCanShowPlaceholder();
            }),
        );
    }, [editor]);

    return canShowPlaceholder;
}

export default function CustomPlainTextPlugin({
                                    contentEditable,
                                    placeholder,
                                }: {
    contentEditable: JSX.Element;
    placeholder:
        | ((isEditable: boolean) => null | JSX.Element)
        | null
        | JSX.Element;
}): JSX.Element {
    const [editor] = useLexicalComposerContext();
    usePlainTextSetup(editor);

    return (
        <>
            <Placeholder content={placeholder} />
            {contentEditable}
        </>
    );
}

function Placeholder({content,}: {
    content: ((isEditable: boolean) => null | JSX.Element) | null | JSX.Element;
}): null | JSX.Element {
    const [editor] = useLexicalComposerContext();
    const showPlaceholder = useCanShowPlaceholder(editor);
    const editable = useLexicalEditable();

    if (!showPlaceholder) {
        return null;
    }

    if (typeof content === 'function') {
        return content(editable);
    } else {
        return content;
    }
}