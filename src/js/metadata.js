/**
 * @description :: metadata, immutable
 */
import Action from './action'

export const bindings = {
	"toggleBold": 'toggleBold',
	"toggleItalic": 'toggleItalic',
	"drawLink": 'drawLink',
	"toggleHeadingSmaller": 'toggleHeadingSmaller',
	"toggleHeadingBigger": 'toggleHeadingBigger',
	"drawImage": 'drawImage',
	"toggleBlockquote": 'toggleBlockquote',
	"toggleOrderedList": 'toggleOrderedList',
	"toggleUnorderedList": 'toggleUnorderedList',
	"toggleCodeBlock": 'toggleCodeBlock',
	"togglePreview": 'togglePreview',
	"toggleStrikethrough": 'toggleStrikethrough',
	"toggleHeading1": 'toggleHeading1',
	"toggleHeading2": 'toggleHeading2',
	"toggleHeading3": 'toggleHeading3',
	"cleanBlock": 'cleanBlock',
	"drawTable": 'drawTable',
	"drawHorizontalRule": 'drawHorizontalRule',
	"undo": 'undo',
	"redo": 'redo',
	"toggleSideBySide": 'toggleSideBySide',
	"toggleFullScreen": 'toggleFullScreen'
};

export const shortcuts = {
	"toggleBold": "Cmd-B",
	"toggleItalic": "Cmd-I",
	"drawLink": "Cmd-K",
	"toggleHeadingSmaller": "Cmd-H",
	"toggleHeadingBigger": "Shift-Cmd-H",
	"cleanBlock": "Cmd-E",
	"drawImage": "Cmd-Alt-I",
	"toggleBlockquote": "Cmd-'",
	"toggleOrderedList": "Cmd-Alt-L",
	"toggleUnorderedList": "Cmd-L",
	"toggleCodeBlock": "Cmd-Alt-C",
	"togglePreview": "Cmd-P",
	"toggleSideBySide": "F9",
	"toggleFullScreen": "F11"
};

export const toolbarBuiltInButtons = {
	"bold": {
		name: "bold",
		action: 'toggleBold',
		className: "fa fa-bold",
		title: "Bold",
		default: true
	},
	"italic": {
		name: "italic",
		action: 'toggleItalic',
		className: "fa fa-italic",
		title: "Italic",
		default: true
	},
	"strikethrough": {
		name: "strikethrough",
		action: 'toggleStrikethrough',
		className: "fa fa-strikethrough",
		title: "Strikethrough"
	},
	"heading": {
		name: "heading",
		action: 'toggleHeadingSmaller',
		className: "fa fa-header",
		title: "Heading",
		default: true
	},
	"heading-smaller": {
		name: "heading-smaller",
		action: 'toggleHeadingSmaller',
		className: "fa fa-header fa-header-x fa-header-smaller",
		title: "Smaller Heading"
	},
	"heading-bigger": {
		name: "heading-bigger",
		action: 'toggleHeadingBigger',
		className: "fa fa-header fa-header-x fa-header-bigger",
		title: "Bigger Heading"
	},
	"heading-1": {
		name: "heading-1",
		action: 'toggleHeading1',
		className: "fa fa-header fa-header-x fa-header-1",
		title: "Big Heading"
	},
	"heading-2": {
		name: "heading-2",
		action: 'toggleHeading2',
		className: "fa fa-header fa-header-x fa-header-2",
		title: "Medium Heading"
	},
	"heading-3": {
		name: "heading-3",
		action: 'toggleHeading3',
		className: "fa fa-header fa-header-x fa-header-3",
		title: "Small Heading"
	},
	"separator-1": {
		name: "separator-1"
	},
	"code": {
		name: "code",
		action: 'toggleCodeBlock',
		className: "fa fa-code",
		title: "Code"
	},
	"quote": {
		name: "quote",
		action: 'toggleBlockquote',
		className: "fa fa-quote-left",
		title: "Quote",
		default: true
	},
	"unordered-list": {
		name: "unordered-list",
		action: 'toggleUnorderedList',
		className: "fa fa-list-ul",
		title: "Generic List",
		default: true
	},
	"ordered-list": {
		name: "ordered-list",
		action: 'toggleOrderedList',
		className: "fa fa-list-ol",
		title: "Numbered List",
		default: true
	},
	"clean-block": {
		name: "clean-block",
		action: 'cleanBlock',
		className: "fa fa-eraser fa-clean-block",
		title: "Clean block"
	},
	"separator-2": {
		name: "separator-2"
	},
	"link": {
		name: "link",
		action: 'drawLink',
		className: "fa fa-link",
		title: "Create Link",
		default: true
	},
	"image": {
		name: "image",
		action: 'drawImage',
		className: "fa fa-picture-o",
		title: "Insert Image",
		default: true
	},
	"table": {
		name: "table",
		action: 'drawTable',
		className: "fa fa-table",
		title: "Insert Table"
	},
	"horizontal-rule": {
		name: "horizontal-rule",
		action: 'drawHorizontalRule',
		className: "fa fa-minus",
		title: "Insert Horizontal Line"
	},
	"separator-3": {
		name: "separator-3"
	},
	"preview": {
		name: "preview",
		action: 'togglePreview',
		className: "fa fa-eye no-disable",
		title: "Toggle Preview",
		default: true
	},
	"side-by-side": {
		name: "side-by-side",
		action: 'toggleSideBySide',
		className: "fa fa-columns no-disable no-mobile",
		title: "Toggle Side by Side",
		default: true
	},
	"fullscreen": {
		name: "fullscreen",
		action: 'toggleFullScreen',
		className: "fa fa-arrows-alt no-disable no-mobile",
		title: "Toggle Fullscreen",
		default: true
	},
	"separator-4": {
		name: "separator-4"
	},
	"guide": {
		name: "guide",
		action: "https://simplemde.com/markdown-guide",
		className: "fa fa-question-circle",
		title: "Markdown Guide",
		default: true
	},
	"separator-5": {
		name: "separator-5"
	},
	"undo": {
		name: "undo",
		action: 'undo',
		className: "fa fa-undo no-disable",
		title: "Undo"
	},
	"redo": {
		name: "redo",
		action: 'redo',
		className: "fa fa-repeat no-disable",
		title: "Redo"
	}
};

export const blockStyles = {
	"bold": "**",
	"code": "```",
	"italic": "*"
};

export const insertTexts = {
	link: ["[", "](#url#)"],
	image: ["![](", "#url#)"],
	table: ["", "\n\n| Column 1 | Column 2 | Column 3 |\n| -------- | -------- | -------- |\n| Text     | Text     | Text     |\n\n"],
	horizontalRule: ["", "\n\n-----\n\n"]
};

export const promptTexts = {
	link: "URL for the link:",
	image: "URL of the image:"
};