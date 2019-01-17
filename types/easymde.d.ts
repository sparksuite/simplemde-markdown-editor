// This file is based on https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/simplemde/index.d.ts,
// which is written by Scalesoft <https://github.com/Scalesoft> and licensed under the MIT license:
// 
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
// 
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
// 
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

/// <reference types="codemirror"/>

declare namespace EasyMDE {
    interface AutoSaveOptions {
        enabled?: boolean;
        delay?: number;
        uniqueId: string;
    }

    interface BlockStyleOptions {
        bold?: string;
        code?: string;
        italic?: string;
    }

    interface InsertTextOptions {
        horizontalRule?: ReadonlyArray<string>;
        image?: ReadonlyArray<string>;
        link?: ReadonlyArray<string>;
        table?: ReadonlyArray<string>;
    }

    interface ParsingOptions {
        allowAtxHeaderWithoutSpace?: boolean;
        strikethrough?: boolean;
        underscoresBreakWords?: boolean;
    }

    interface RenderingOptions {
        singleLineBreaks?: boolean;
        codeSyntaxHighlighting: boolean;
    }

    interface Shortcuts {
        [action: string]: string | undefined | null;
        toggleBlockquote?: string | null;
        toggleBold?: string | null;
        cleanBlock?: string | null;
        toggleHeadingSmaller?: string | null;
        toggleItalic?: string | null;
        drawLink?: string | null;
        toggleUnorderedList?: string | null;
        togglePreview?: string | null;
        toggleCodeBlock?: string | null;
        drawImage?: string | null;
        toggleOrderedList?: string | null;
        toggleHeadingBigger?: string | null;
        toggleSideBySide?: string | null;
        toggleFullScreen?: string | null;
    }

    interface StatusBarItem {
        className: string;
        defaultValue: (element: HTMLElement) => void;
        onUpdate: (element: HTMLElement) => void;
    }

    interface ToolbarIcon {
        name: string;
        action: string|((editor: EasyMDE) => void);
        className: string;
        title: string;
    }

    interface Options {
        autoDownloadFontAwesome?: boolean;
        autofocus?: boolean;
        autosave?: AutoSaveOptions;
        blockStyles?: BlockStyleOptions;
        element?: HTMLElement;
        forceSync?: boolean;
        hideIcons?: ReadonlyArray<string>;
        indentWithTabs?: boolean;
        initialValue?: string;
        insertTexts?: InsertTextOptions;
        lineWrapping?: boolean;
        parsingConfig?: ParsingOptions;
        placeholder?: string;
        previewRender?: (markdownPlaintext: string, previewElement: HTMLElement) => string;
        promptURLs?: boolean;
        renderingConfig?: RenderingOptions;
        shortcuts?: Shortcuts;
        showIcons?: ReadonlyArray<string>;
        spellChecker?: boolean;
        status?: boolean|ReadonlyArray<string|StatusBarItem>;
        styleSelectedText?: boolean;
        tabSize?: number;
        toolbar?: boolean|ReadonlyArray<string|ToolbarIcon>;
        toolbarTips?: boolean;
        onToggleFullScreen?: (goingIntoFullScreen: boolean) => void;
        theme?: string;
    }
}

declare class EasyMDE {
    constructor(options?: EasyMDE.Options);
    value(): string;
    value(val: string): void;
    codemirror: CodeMirror.Editor;
    toTextArea(): void;
    isPreviewActive(): boolean;
    isSideBySideActive(): boolean;
    isFullscreenActive(): boolean;
    clearAutosavedValue(): void;

    static toggleBold: (editor: EasyMDE) => void;
    static toggleItalic: (editor: EasyMDE) => void;
    static toggleStrikethrough: (editor: EasyMDE) => void;
    static toggleHeadingSmaller: (editor: EasyMDE) => void;
    static toggleHeadingBigger: (editor: EasyMDE) => void;
    static toggleHeading1: (editor: EasyMDE) => void;
    static toggleHeading2: (editor: EasyMDE) => void;
    static toggleHeading3: (editor: EasyMDE) => void;
    static toggleCodeBlock: (editor: EasyMDE) => void;
    static toggleBlockquote: (editor: EasyMDE) => void;
    static toggleUnorderedList: (editor: EasyMDE) => void;
    static toggleOrderedList: (editor: EasyMDE) => void;
    static cleanBlock: (editor: EasyMDE) => void;
    static drawLink: (editor: EasyMDE) => void;
    static drawImage: (editor: EasyMDE) => void;
    static drawTable: (editor: EasyMDE) => void;
    static drawHorizontalRule: (editor: EasyMDE) => void;
    static togglePreview: (editor: EasyMDE) => void;
    static toggleSideBySide: (editor: EasyMDE) => void;
    static toggleFullScreen: (editor: EasyMDE) => void;
    static undo: (editor: EasyMDE) => void;
    static redo: (editor: EasyMDE) => void;
}

export as namespace EasyMDE;
export = EasyMDE;
