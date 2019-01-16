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
        horizontalRule?: string[];
        image?: string[];
        link?: string[];
        table?: string[];
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

    interface ShortcutsArray {
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
        hideIcons?: string[];
        indentWithTabs?: boolean;
        initialValue?: string;
        insertTexts?: InsertTextOptions;
        lineWrapping?: boolean;
        parsingConfig?: ParsingOptions;
        placeholder?: string;
        previewRender?: (markdownPlaintext: string, previewElement: HTMLElement) => string;
        promptURLs?: boolean;
        renderingConfig?: RenderingOptions;
        shortcuts?: ShortcutsArray;
        showIcons?: string[];
        spellChecker?: boolean;
        status?: boolean|Array<string|StatusBarItem>;
        styleSelectedText?: boolean;
        tabSize?: number;
        toolbar?: boolean|Array<string|ToolbarIcon>;
        toolbarTips?: boolean;
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
