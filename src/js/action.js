/**
 * Created by WittBulter on 2017/1/17.
 */
import Base from './base'

export default class Action {
	constructor (){
		this.saved_overflow = ''
	}

	/**
	 * Action for toggling bold.
	 */
	static toggleBold (editor){
		Base.toggleBlock(editor, "bold", editor.options.blockStyles.bold);
	}

	/**
	 * Action for toggling italic.
	 */
	static toggleItalic (editor){
		Base.toggleBlock(editor, "italic", editor.options.blockStyles.italic);
	}

	/**
	 * Action for drawing a link.
	 */
	static drawLink (editor){
		const cm = editor.codemirror;
		const stat = Base.getState(cm);
		const options = editor.options;
		let url = "http://";
		if (options.promptURLs){
			url = prompt(options.promptTexts.link);
			if (!url){
				return false;
			}
		}
		Base.replaceSelection(cm, stat.link, options.insertTexts.link, url);
	}

	/**
	 * Action for toggling heading size: normal -> h1 -> h2 -> h3 -> h4 -> h5 -> h6 -> normal
	 */
	static toggleHeadingSmaller (editor){
		const cm = editor.codemirror;
		Base.toggleHeading(cm, "smaller");
	}

	/**
	 * Action for toggling heading size: normal -> h6 -> h5 -> h4 -> h3 -> h2 -> h1 -> normal
	 */
	static toggleHeadingBigger (editor){
		const cm = editor.codemirror;
		Base.toggleHeading(cm, "bigger");
	}

	/**
	 * Action for drawing an img.
	 */
	static drawImage (editor){
		const cm = editor.codemirror;
		const stat = Base.getState(cm);
		const options = editor.options;
		let url = "http://";
		if (options.promptURLs){
			url = prompt(options.promptTexts.image);
			if (!url){
				return false;
			}
		}
		Base.replaceSelection(cm, stat.image, options.insertTexts.image, url);
	}

	/**
	 * Action for toggling blockquote.
	 */
	static toggleBlockquote (editor){
		const cm = editor.codemirror;
		Base.toggleLine(cm, "quote");
	}

	/**
	 * Action for toggling ol.
	 */
	static toggleOrderedList (editor){
		const cm = editor.codemirror;
		Base.toggleLine(cm, "ordered-list");
	}

	/**
	 * Action for toggling ul.
	 */
	static toggleUnorderedList (editor){
		const cm = editor.codemirror;
		Base.toggleLine(cm, "unordered-list");
	}

	/**
	 * Action for toggling code block.
	 */
	static toggleCodeBlock (editor){
		let fenceCharsToInsert = editor.options.blockStyles.code;

		const fencing_line = line =>{
			/* return true, if this is a ``` or ~~~ line */
			if (typeof line !== "object"){
				throw "fencing_line() takes a 'line' object (not a line number, or line text).  Got: " + typeof line + ": " + line;
			}
			return line.styles && line.styles[2] && line.styles[2].indexOf("formatting-code-block") !== -1;
		}

		const token_state = token =>{
			// base goes an extra level deep when mode backdrops are used, e.g. spellchecker on
			return token.state.base.base || token.state.base;
		}

		const code_type = (cm, line_num, line = cm.getLineHandle(line_num), firstTok, lastTok) =>{
			/*
			 * Return "single", "indented", "fenced" or false
			 *
			 * cm and line_num are required.  Others are optional for efficiency
			 *   To check in the middle of a line, pass in firstTok yourself.
			 */
			firstTok = firstTok || cm.getTokenAt({
					line: line_num,
					ch: 1
				});
			lastTok = lastTok || (!!line.text && cm.getTokenAt({
					line: line_num,
					ch: line.text.length - 1
				}));
			let types = firstTok.type? firstTok.type.split(" "): [];
			if (lastTok && token_state(lastTok).indentedCode){
				// have to check last char, since first chars of first line aren"t marked as indented
				return "indented";
			} else if (types.indexOf("comment") === -1){
				// has to be after "indented" check, since first chars of first indented line aren"t marked as such
				return false;
			} else if (token_state(firstTok).fencedChars || token_state(lastTok).fencedChars || fencing_line(line)){
				return "fenced";
			} else{
				return "single";
			}
		}

		const insertFencingAtSelection = (cm, cur_start, cur_end, fenceCharsToInsert) =>{
			let start_line_sel = cur_start.line + 1,
				end_line_sel = cur_end.line + 1,
				sel_multi = cur_start.line !== cur_end.line,
				repl_start = fenceCharsToInsert + "\n",
				repl_end = "\n" + fenceCharsToInsert;
			if (sel_multi){
				end_line_sel++;
			}
			// handle last char including \n or not
			if (sel_multi && cur_end.ch === 0){
				repl_end = fenceCharsToInsert + "\n";
				end_line_sel--;
			}
			Base.replaceSelection(cm, false, [repl_start, repl_end]);
			cm.setSelection({
				line: start_line_sel,
				ch: 0
			}, {
				line: end_line_sel,
				ch: 0
			});
		}

		let cm = editor.codemirror,
			cur_start = cm.getCursor("start"),
			cur_end = cm.getCursor("end"),
			tok = cm.getTokenAt({
				line: cur_start.line,
				ch: cur_start.ch || 1
			}), // avoid ch 0 which is a cursor pos but not token
			line = cm.getLineHandle(cur_start.line),
			is_code = code_type(cm, cur_start.line, line, tok);
		let block_start, block_end, lineCount;

		if (is_code === "single"){
			// similar to some SimpleMDE _toggleBlock logic
			let start = line.text.slice(0, cur_start.ch)
					.replace("`", ""),
				end = line.text.slice(cur_start.ch)
					.replace("`", "");
			cm.replaceRange(start + end, {
				line: cur_start.line,
				ch: 0
			}, {
				line: cur_start.line,
				ch: 99999999999999
			});
			cur_start.ch--;
			if (cur_start !== cur_end){
				cur_end.ch--;
			}
			cm.setSelection(cur_start, cur_end);
			cm.focus();
		} else if (is_code === "fenced"){
			if (cur_start.line !== cur_end.line || cur_start.ch !== cur_end.ch){
				// use selection

				// find the fenced line so we know what type it is (tilde, backticks, number of them)
				for (block_start = cur_start.line; block_start >= 0; block_start--){
					line = cm.getLineHandle(block_start);
					if (fencing_line(line)){
						break;
					}
				}
				let fencedTok = cm.getTokenAt({
					line: block_start,
					ch: 1
				});
				let fence_chars = token_state(fencedTok).fencedChars;
				let start_text, start_line;
				let end_text, end_line;
				// check for selection going up against fenced lines, in which case we don't want to add more fencing
				if (fencing_line(cm.getLineHandle(cur_start.line))){
					start_text = "";
					start_line = cur_start.line;
				} else if (fencing_line(cm.getLineHandle(cur_start.line - 1))){
					start_text = "";
					start_line = cur_start.line - 1;
				} else{
					start_text = fence_chars + "\n";
					start_line = cur_start.line;
				}
				if (fencing_line(cm.getLineHandle(cur_end.line))){
					end_text = "";
					end_line = cur_end.line;
					if (cur_end.ch === 0){
						end_line += 1;
					}
				} else if (cur_end.ch !== 0 && fencing_line(cm.getLineHandle(cur_end.line + 1))){
					end_text = "";
					end_line = cur_end.line + 1;
				} else{
					end_text = fence_chars + "\n";
					end_line = cur_end.line + 1;
				}
				if (cur_end.ch === 0){
					// full last line selected, putting cursor at beginning of next
					end_line -= 1;
				}
				cm.operation(function (){
					// end line first, so that line numbers don't change
					cm.replaceRange(end_text, {
						line: end_line,
						ch: 0
					}, {
						line: end_line + (end_text? 0: 1),
						ch: 0
					});
					cm.replaceRange(start_text, {
						line: start_line,
						ch: 0
					}, {
						line: start_line + (start_text? 0: 1),
						ch: 0
					});
				});
				cm.setSelection({
					line: start_line + (start_text? 1: 0),
					ch: 0
				}, {
					line: end_line + (start_text? 1: -1),
					ch: 0
				});
				cm.focus();
			} else{
				// no selection, search for ends of this fenced block
				let search_from = cur_start.line;
				if (fencing_line(cm.getLineHandle(cur_start.line))){ // gets a little tricky if cursor is right on a fenced line
					if (code_type(cm, cur_start.line + 1) === "fenced"){
						block_start = cur_start.line;
						search_from = cur_start.line + 1; // for searching for "end"
					} else{
						block_end = cur_start.line;
						search_from = cur_start.line - 1; // for searching for "start"
					}
				}
				if (block_start === undefined){
					for (block_start = search_from; block_start >= 0; block_start--){
						line = cm.getLineHandle(block_start);
						if (fencing_line(line)){
							break;
						}
					}
				}
				if (block_end === undefined){
					lineCount = cm.lineCount();
					for (block_end = search_from; block_end < lineCount; block_end++){
						line = cm.getLineHandle(block_end);
						if (fencing_line(line)){
							break;
						}
					}
				}
				cm.operation(function (){
					cm.replaceRange("", {
						line: block_start,
						ch: 0
					}, {
						line: block_start + 1,
						ch: 0
					});
					cm.replaceRange("", {
						line: block_end - 1,
						ch: 0
					}, {
						line: block_end,
						ch: 0
					});
				});
				cm.focus();
			}
		} else if (is_code === "indented"){
			if (cur_start.line !== cur_end.line || cur_start.ch !== cur_end.ch){
				// use selection
				block_start = cur_start.line;
				block_end = cur_end.line;
				if (cur_end.ch === 0){
					block_end--;
				}
			} else{
				// no selection, search for ends of this indented block
				for (block_start = cur_start.line; block_start >= 0; block_start--){
					line = cm.getLineHandle(block_start);
					if (line.text.match(/^\s*$/)){
						// empty or all whitespace - keep going
						continue;
					} else{
						if (code_type(cm, block_start, line) !== "indented"){
							block_start += 1;
							break;
						}
					}
				}
				lineCount = cm.lineCount();
				for (block_end = cur_start.line; block_end < lineCount; block_end++){
					line = cm.getLineHandle(block_end);
					if (line.text.match(/^\s*$/)){
						// empty or all whitespace - keep going
						continue;
					} else{
						if (code_type(cm, block_end, line) !== "indented"){
							block_end -= 1;
							break;
						}
					}
				}
			}
			// if we are going to un-indent based on a selected set of lines, and the next line is indented too, we need to
			// insert a blank line so that the next line(s) continue to be indented code
			let next_line = cm.getLineHandle(block_end + 1),
				next_line_last_tok = next_line && cm.getTokenAt({
						line: block_end + 1,
						ch: next_line.text.length - 1
					}),
				next_line_indented = next_line_last_tok && token_state(next_line_last_tok).indentedCode;
			if (next_line_indented){
				cm.replaceRange("\n", {
					line: block_end + 1,
					ch: 0
				});
			}

			for (var i = block_start; i <= block_end; i++){
				cm.indentLine(i, "subtract"); // TODO: this doesn't get tracked in the history, so can't be undone :(
			}
			cm.focus();
		} else{
			// insert code formatting
			let no_sel_and_starting_of_line = (cur_start.line === cur_end.line && cur_start.ch === cur_end.ch && cur_start.ch === 0);
			let sel_multi = cur_start.line !== cur_end.line;
			if (no_sel_and_starting_of_line || sel_multi){
				insertFencingAtSelection(cm, cur_start, cur_end, fenceCharsToInsert);
			} else{
				Base.replaceSelection(cm, false, ["`", "`"]);
			}
		}
	}

	/**
	 * Toggle full screen of the editor.
	 */
	static toggleFullScreen (editor){
		// Set fullscreen
		let cm = editor.codemirror;
		cm.setOption("fullScreen", !cm.getOption("fullScreen"));


		// Prevent scrolling on body during fullscreen active
		if (cm.getOption("fullScreen")){
			this.saved_overflow = document.body.style.overflow;
			document.body.style.overflow = "hidden";
		} else{
			document.body.style.overflow = this.saved_overflow;
		}


		// Update toolbar class
		let wrap = cm.getWrapperElement();

		if (!/fullscreen/.test(wrap.previousSibling.className)){
			wrap.previousSibling.className += " fullscreen";
		} else{
			wrap.previousSibling.className = wrap.previousSibling.className.replace(/\s*fullscreen\b/, "");
		}


		// Update toolbar button
		let toolbarButton = editor.toolbarElements.fullscreen;

		if (!/active/.test(toolbarButton.className)){
			toolbarButton.className += " active";
		} else{
			toolbarButton.className = toolbarButton.className.replace(/\s*active\s*/g, "");
		}


		// Hide side by side if needed
		const sidebyside = cm.getWrapperElement().nextSibling;
		if (/editor-preview-active-side/.test(sidebyside.className))
			this.toggleSideBySide(editor);
	}


	/**
	 * Toggle side by side preview
	 */
	static toggleSideBySide (editor){
		let cm = editor.codemirror;
		let wrapper = cm.getWrapperElement();
		let preview = wrapper.nextSibling;
		let toolbarButton = editor.toolbarElements["side-by-side"];
		let useSideBySideListener = false;
		if (/editor-preview-active-side/.test(preview.className)){
			preview.className = preview.className.replace(
				/\s*editor-preview-active-side\s*/g, ""
			);
			toolbarButton.className = toolbarButton.className.replace(/\s*active\s*/g, "");
			wrapper.className = wrapper.className.replace(/\s*CodeMirror-sided\s*/g, " ");
		} else{
			// When the preview button is clicked for the first time,
			// give some time for the transition from editor.css to fire and the view to slide from right to left,
			// instead of just appearing.
			setTimeout(function (){
				if (!cm.getOption("fullScreen"))
					this.toggleFullScreen(editor);
				preview.className += " editor-preview-active-side";
			}, 1);
			toolbarButton.className += " active";
			wrapper.className += " CodeMirror-sided";
			useSideBySideListener = true;
		}

		// Hide normal preview if active
		let previewNormal = wrapper.lastChild;
		if (/editor-preview-active/.test(previewNormal.className)){
			previewNormal.className = previewNormal.className.replace(
				/\s*editor-preview-active\s*/g, ""
			);
			let toolbar = editor.toolbarElements.preview;
			let toolbar_div = wrapper.previousSibling;
			toolbar.className = toolbar.className.replace(/\s*active\s*/g, "");
			toolbar_div.className = toolbar_div.className.replace(/\s*disabled-for-preview*/g, "");
		}

		const sideBySideRenderingFunction = function (){
			preview.innerHTML = editor.options.previewRender(editor.value(), preview);
		};

		if (!cm.sideBySideRenderingFunction){
			cm.sideBySideRenderingFunction = sideBySideRenderingFunction;
		}

		if (useSideBySideListener){
			preview.innerHTML = editor.options.previewRender(editor.value(), preview);
			cm.on("update", cm.sideBySideRenderingFunction);
		} else{
			cm.off("update", cm.sideBySideRenderingFunction);
		}

		// Refresh to fix selection being off (#309)
		cm.refresh();
	}

	/**
	 * Preview action.
	 */
	static togglePreview (editor){
		let cm = editor.codemirror;
		let wrapper = cm.getWrapperElement();
		let toolbar_div = wrapper.previousSibling;
		let toolbar = editor.options.toolbar? editor.toolbarElements.preview: false;
		let preview = wrapper.lastChild;
		if (!preview || !/editor-preview/.test(preview.className)){
			preview = document.createElement("div");
			preview.className = "editor-preview";
			wrapper.appendChild(preview);
		}
		if (/editor-preview-active/.test(preview.className)){
			preview.className = preview.className.replace(
				/\s*editor-preview-active\s*/g, ""
			);
			if (toolbar){
				toolbar.className = toolbar.className.replace(/\s*active\s*/g, "");
				toolbar_div.className = toolbar_div.className.replace(/\s*disabled-for-preview*/g, "");
			}
		} else{
			// When the preview button is clicked for the first time,
			// give some time for the transition from editor.css to fire and the view to slide from right to left,
			// instead of just appearing.
			setTimeout(function (){
				preview.className += " editor-preview-active";
			}, 1);
			if (toolbar){
				toolbar.className += " active";
				toolbar_div.className += " disabled-for-preview";
			}
		}
		preview.innerHTML = editor.options.previewRender(editor.value(), preview);

		// Turn off side by side if needed
		const sidebyside = cm.getWrapperElement().nextSibling;
		if (/editor-preview-active-side/.test(sidebyside.className))
			this.toggleSideBySide(editor);
	}

	/**
	 * Action for toggling strikethrough.
	 */
	static toggleStrikethrough (editor){
		Base.toggleBlock(editor, "strikethrough", "~~");
	}

	/**
	 * Action for toggling heading size 1, 2, 3
	 */
	static toggleHeading1 (editor){
		const cm = editor.codemirror;
		Base.toggleHeading(cm, undefined, 1);
	}

	static toggleHeading2 (editor){
		const cm = editor.codemirror;
		Base.toggleHeading(cm, undefined, 2);
	}

	static toggleHeading3 (editor){
		const cm = editor.codemirror;
		Base.toggleHeading(cm, undefined, 3);
	}

	/**
	 * Action for clean block (remove headline, list, blockquote code, markers)
	 */
	static cleanBlock (editor){
		const cm = editor.codemirror;
		Base.cleanBlock(cm);
	}

	/**
	 * Action for drawing a table.
	 */
	static drawTable (editor){
		const cm = editor.codemirror;
		const stat = Base.getState(cm);
		const options = editor.options;
		Base.replaceSelection(cm, stat.table, options.insertTexts.table);
	}

	/**
	 * Action for drawing a horizontal rule.
	 */
	static drawHorizontalRule (editor){
		const cm = editor.codemirror;
		const stat = Base.getState(cm);
		const options = editor.options;
		Base.replaceSelection(cm, stat.image, options.insertTexts.horizontalRule);
	}

	/**
	 * Undo action.
	 */
	static undo (editor){
		const cm = editor.codemirror;
		cm.undo();
		cm.focus();
	}

	/**
	 * Redo action.
	 */
	static redo (editor){
		const cm = editor.codemirror;
		cm.redo();
		cm.focus();
	}


}