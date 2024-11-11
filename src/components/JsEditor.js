import React, { useState } from "react";
import {
    Editor,
    EditorState,
    RichUtils,
    SelectionState,
    Modifier,
    convertToRaw,
    convertFromRaw,
} from "draft-js";

const JsEditor = () => {
    const storeRaw = localStorage.getItem("draftRaw");
    const [editorState, setEditorState] = useState(() =>
        storeRaw
            ? EditorState.createWithContent(convertFromRaw(JSON.parse(storeRaw)))
            : EditorState.createEmpty()
    );
    const _ = require("lodash");

    const findWithRegex = (regex, contentBlock, callback) => {
        const text = contentBlock.getText();
        let matchArr, start, end;
        while ((matchArr = regex.exec(text)) !== null) {
            start = matchArr.index;
            end = start + matchArr[0].length;
            callback(start, end);
        }
    };

    const styles = ["BOLD", "ITALIC", "UNDERLINE", "STRIKETHROUGH", "CODE"];

    const styleMap = {
        COLOR_RED: {
            color: "#FF0000",
        },
        COLOR_BLACK: {
            color: "#000000",
        },
    };

    const clearInlineStyles = () => {
        const contentWithoutStyles = _.reduce(
            styles,
            (newContentState, style) =>
                Modifier.removeInlineStyle(
                    newContentState,
                    editorState.getSelection(),
                    style
                ),
            editorState.getCurrentContent()
        );

        const newStateWithoutStyles = EditorState.push(
            editorState,
            contentWithoutStyles
        );

        const newState = RichUtils.toggleBlockType(
            newStateWithoutStyles,
            "unstyled"
        );
        setEditorState(RichUtils.toggleInlineStyle(newState, "COLOR_BLACK"));
    };

    const saveData = () => {
        var contentRaw = convertToRaw(editorState.getCurrentContent());
        localStorage.setItem("draftRaw", JSON.stringify(contentRaw));
    };

    return (
        <div>
            <div className="button-container">
                <button onClick={saveData}>Save</button>

                <button onClick={clearInlineStyles}>Remove Style</button>
            </div>

            <div className="header-container">
                <h4>Demo editor by Gopal</h4>
            </div>

            <Editor
                editorState={editorState}
                customStyleMap={styleMap}
                onChange={(editorState) => {
                    setEditorState(editorState);
                    const textnew = editorState
                        .getCurrentContent()
                        .getPlainText("\u0001");

                    const selectionsToReplace = [];
                    const blockMap = editorState.getCurrentContent().getBlockMap();

                    let regex;
                    if (textnew.substring(textnew.length - 2) === "# ") {
                        regex = new RegExp(`# `, "g");
                        blockMap.forEach((contentBlock) =>
                            findWithRegex(regex, contentBlock, (start, end) => {
                                const blockKey = contentBlock.getKey();
                                const blockSelection = SelectionState.createEmpty(
                                    blockKey
                                ).merge({
                                    anchorOffset: start,
                                    focusOffset: end,
                                });
                                selectionsToReplace.push(blockSelection);
                            })
                        );
                    } else if (/\w*(?<!\*)\*[\s]/g.test(textnew)) {
                        regex = /\w*(?<!\*)\*[\s]/g;
                        blockMap.forEach((contentBlock) =>
                            findWithRegex(regex, contentBlock, (start, end) => {
                                const blockKey = contentBlock.getKey();
                                const blockSelection = SelectionState.createEmpty(
                                    blockKey
                                ).merge({
                                    anchorOffset: start,
                                    focusOffset: end,
                                });
                                selectionsToReplace.push(blockSelection);
                            })
                        );
                    } else if (/\w*(?<!\*)\*\*[\s]/g.test(textnew)) {
                        regex = /\w*(?<!\*)\*\*[\s]/g;
                        blockMap.forEach((contentBlock) =>
                            findWithRegex(regex, contentBlock, (start, end) => {
                                const blockKey = contentBlock.getKey();
                                const blockSelection = SelectionState.createEmpty(
                                    blockKey
                                ).merge({
                                    anchorOffset: start,
                                    focusOffset: end,
                                });
                                selectionsToReplace.push(blockSelection);
                            })
                        );
                    } else if (/\w*(?<!\*)\*\*\*[\s]/g.test(textnew)) {
                        regex = /\w*(?<!\*)\*\*\*[\s]/g;
                        blockMap.forEach((contentBlock) =>
                            findWithRegex(regex, contentBlock, (start, end) => {
                                const blockKey = contentBlock.getKey();
                                const blockSelection = SelectionState.createEmpty(
                                    blockKey
                                ).merge({
                                    anchorOffset: start,
                                    focusOffset: end,
                                });
                                selectionsToReplace.push(blockSelection);
                            })
                        );
                    }
                    let contentState = editorState.getCurrentContent();

                    selectionsToReplace.forEach((selectionState) => {
                        contentState = Modifier.replaceText(
                            contentState,
                            selectionState,
                            ""
                        );
                    });

                    const newState = EditorState.push(editorState, contentState);
                    const newStateUnstyled = RichUtils.toggleBlockType(
                        newState,
                        "unstyled"
                    );
                    const newStateMFTE = EditorState.moveFocusToEnd(newStateUnstyled);

                    if (textnew.substring(textnew.length - 2) === "# ") {
                        const newStateHeader = RichUtils.toggleBlockType(
                            newStateMFTE,
                            "header-one"
                        );
                        setEditorState(
                            RichUtils.toggleInlineStyle(newStateHeader, "COLOR_BLACK")
                        );
                    } else if (/\w*(?<!\*)\*[\s]/g.test(textnew)) {
                        const newStateBold = RichUtils.toggleInlineStyle(
                            newStateMFTE,
                            "BOLD"
                        );
                        setEditorState(
                            RichUtils.toggleInlineStyle(newStateBold, "COLOR_BLACK")
                        );
                    } else if (/\w*(?<!\*)\*\*[\s]/g.test(textnew)) {
                        setEditorState(
                            RichUtils.toggleInlineStyle(newStateMFTE, "COLOR_RED")
                        );
                    } else if (/\w*(?<!\*)\*\*\*[\s]/g.test(textnew)) {
                        const newStateUnderline = RichUtils.toggleInlineStyle(
                            newStateMFTE,
                            "UNDERLINE"
                        );
                        setEditorState(
                            RichUtils.toggleInlineStyle(newStateUnderline, "COLOR_BLACK")
                        );
                    }
                }}
                placeholder="Write Here"
            />

            <div className="list-container">
                <h4>Instructions</h4>
                <ul>
                    <li># and space = Header</li>
                    <li>* and space = Bold</li>
                    <li>** and space = Red Line</li>
                    <li>*** and space = Underline</li>
                    <li>Save = To save text</li>
                    <li>Remove Styles = To remove inline styles</li>
                </ul>
            </div>
        </div>
    );
};

export default JsEditor;
