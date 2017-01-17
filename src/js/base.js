/**
 * @description :: Basic operation
 */

export default new class Base {
	constructor (){}

	getState (cm, pos = cm.getCursor("start")){
		let stat = cm.getTokenAt(pos);
		if(!stat.type) return {};
		const types = stat.type.split(" ");

		let ret = {},
			data, text;
		for(let i = 0; i < types.length; i++) {
			data = types[i];
			if(data === "strong") {
				ret.bold = true;
			} else if(data === "variable-2") {
				text = cm.getLine(pos.line);
				if(/^\s*\d+\.\s/.test(text)) {
					ret["ordered-list"] = true;
				} else {
					ret["unordered-list"] = true;
				}
			} else if(data === "atom") {
				ret.quote = true;
			} else if(data === "em") {
				ret.italic = true;
			} else if(data === "quote") {
				ret.quote = true;
			} else if(data === "strikethrough") {
				ret.strikethrough = true;
			} else if(data === "comment") {
				ret.code = true;
			} else if(data === "link") {
				ret.link = true;
			} else if(data === "tag") {
				ret.image = true;
			} else if(data.match(/^header(\-[1-6])?$/)) {
				ret[data.replace("header", "heading")] = true;
			}
		}
		return ret;
	}

	toggleBlock (editor, type, start_chars, end_chars){
		if(/editor-preview-active/.test(editor.codemirror.getWrapperElement().lastChild.className)) return;

		end_chars = (typeof end_chars === "undefined") ? start_chars : end_chars;
		let cm = editor.codemirror;
		let stat = this.getState(cm);

		let text;
		let start = start_chars;
		let end = end_chars;

		let startPoint = cm.getCursor("start");
		let endPoint = cm.getCursor("end");

		if(stat[type]) {
			text = cm.getLine(startPoint.line);
			start = text.slice(0, startPoint.ch);
			end = text.slice(startPoint.ch);
			if(type == "bold") {
				start = start.replace(/(\*\*|__)(?![\s\S]*(\*\*|__))/, "");
				end = end.replace(/(\*\*|__)/, "");
			} else if(type == "italic") {
				start = start.replace(/(\*|_)(?![\s\S]*(\*|_))/, "");
				end = end.replace(/(\*|_)/, "");
			} else if(type == "strikethrough") {
				start = start.replace(/(\*\*|~~)(?![\s\S]*(\*\*|~~))/, "");
				end = end.replace(/(\*\*|~~)/, "");
			}
			cm.replaceRange(start + end, {
				line: startPoint.line,
				ch: 0
			}, {
				line: startPoint.line,
				ch: 99999999999999
			});

			if(type == "bold" || type == "strikethrough") {
				startPoint.ch -= 2;
				if(startPoint !== endPoint) {
					endPoint.ch -= 2;
				}
			} else if(type == "italic") {
				startPoint.ch -= 1;
				if(startPoint !== endPoint) {
					endPoint.ch -= 1;
				}
			}
		} else {
			text = cm.getSelection();
			if(type == "bold") {
				text = text.split("**").join("");
				text = text.split("__").join("");
			} else if(type == "italic") {
				text = text.split("*").join("");
				text = text.split("_").join("");
			} else if(type == "strikethrough") {
				text = text.split("~~").join("");
			}
			cm.replaceSelection(start + text + end);

			startPoint.ch += start_chars.length;
			endPoint.ch = startPoint.ch + text.length;
		}

		cm.setSelection(startPoint, endPoint);
		cm.focus();
	}

	replaceSelection (cm, active, startEnd, url){
		if(/editor-preview-active/.test(cm.getWrapperElement().lastChild.className))
			return;

		let text;
		let start = startEnd[0];
		let end = startEnd[1];
		let startPoint = cm.getCursor("start");
		let endPoint = cm.getCursor("end");
		if(url) {
			end = end.replace("#url#", url);
		}
		if(active) {
			text = cm.getLine(startPoint.line);
			start = text.slice(0, startPoint.ch);
			end = text.slice(startPoint.ch);
			cm.replaceRange(start + end, {
				line: startPoint.line,
				ch: 0
			});
		} else {
			text = cm.getSelection();
			cm.replaceSelection(start + text + end);

			startPoint.ch += start.length;
			if(startPoint !== endPoint) {
				endPoint.ch += start.length;
			}
		}
		cm.setSelection(startPoint, endPoint);
		cm.focus();
	}

	toggleHeading (cm, direction, size){
		if(/editor-preview-active/.test(cm.getWrapperElement().lastChild.className))
			return;

		const startPoint = cm.getCursor("start");
		const endPoint = cm.getCursor("end");
		for(let i = startPoint.line; i <= endPoint.line; i++) {
			(function(i) {
				let text = cm.getLine(i);
				let currHeadingLevel = text.search(/[^#]/);

				if(direction !== undefined) {
					if(currHeadingLevel <= 0) {
						if(direction == "bigger") {
							text = "###### " + text;
						} else {
							text = "# " + text;
						}
					} else if(currHeadingLevel == 6 && direction == "smaller") {
						text = text.substr(7);
					} else if(currHeadingLevel == 1 && direction == "bigger") {
						text = text.substr(2);
					} else {
						if(direction == "bigger") {
							text = text.substr(1);
						} else {
							text = "#" + text;
						}
					}
				} else {
					if(size == 1) {
						if(currHeadingLevel <= 0) {
							text = "# " + text;
						} else if(currHeadingLevel == size) {
							text = text.substr(currHeadingLevel + 1);
						} else {
							text = "# " + text.substr(currHeadingLevel + 1);
						}
					} else if(size == 2) {
						if(currHeadingLevel <= 0) {
							text = "## " + text;
						} else if(currHeadingLevel == size) {
							text = text.substr(currHeadingLevel + 1);
						} else {
							text = "## " + text.substr(currHeadingLevel + 1);
						}
					} else {
						if(currHeadingLevel <= 0) {
							text = "### " + text;
						} else if(currHeadingLevel == size) {
							text = text.substr(currHeadingLevel + 1);
						} else {
							text = "### " + text.substr(currHeadingLevel + 1);
						}
					}
				}

				cm.replaceRange(text, {
					line: i,
					ch: 0
				}, {
					line: i,
					ch: 99999999999999
				});
			})(i);
		}
		cm.focus();
	}

	toggleLine (cm, name){
		if(/editor-preview-active/.test(cm.getWrapperElement().lastChild.className)) return;

		let stat = this.getState(cm);
		const startPoint = cm.getCursor("start");
		const endPoint = cm.getCursor("end");
		const repl = {
			"quote": /^(\s*)\>\s+/,
			"unordered-list": /^(\s*)(\*|\-|\+)\s+/,
			"ordered-list": /^(\s*)\d+\.\s+/
		};
		const map = {
			"quote": "> ",
			"unordered-list": "* ",
			"ordered-list": "1. "
		};
		for(let i = startPoint.line; i <= endPoint.line; i++) {
			(function(i) {
				let text = cm.getLine(i);
				if(stat[name]) {
					text = text.replace(repl[name], "$1");
				} else {
					text = map[name] + text;
				}
				cm.replaceRange(text, {
					line: i,
					ch: 0
				}, {
					line: i,
					ch: 99999999999999
				});
			})(i);
		}
		cm.focus();
	}

	cleanBlock (cm){
		if(/editor-preview-active/.test(cm.getWrapperElement().lastChild.className))
			return;

		const startPoint = cm.getCursor("start");
		const endPoint = cm.getCursor("end");
		let text;

		for(let line = startPoint.line; line <= endPoint.line; line++) {
			text = cm.getLine(line);
			text = text.replace(/^[ ]*([# ]+|\*|\-|[> ]+|[0-9]+(.|\)))[ ]*/, "");

			cm.replaceRange(text, {
				line: line,
				ch: 0
			}, {
				line: line,
				ch: 99999999999999
			});
		}
	}

}