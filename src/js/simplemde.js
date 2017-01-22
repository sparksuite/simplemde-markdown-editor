/*global require,module*/
import CodeMirror from 'codemirror'
import CodeMirrorSpellChecker from 'codemirror-spell-checker'
import marked from 'marked'
import 'codemirror/addon/edit/continuelist'
import 'codemirror/addon/display/fullscreen'
import 'codemirror/addon/mode/overlay'
import 'codemirror/addon/display/placeholder'
import 'codemirror/addon/selection/mark-selection'
import './codemirror/tablist'
import 'codemirror/mode/markdown/markdown'
import 'codemirror/mode/gfm/gfm'
import 'codemirror/mode/xml/xml'

import Action from './action'
import utils from './utils'
import base from './base'
import {
	bindings,
	shortcuts,
	toolbarBuiltInButtons,
	blockStyles,
	insertTexts,
	promptTexts
} from './metadata'

/**
 * Create icon element for toolbar.
 */
const createIcon = (options = {}, enableTooltips = true, shortcuts) => {
	let el = document.createElement("a");

	if(options.title && enableTooltips) {
		el.title = createTootlip(options.title, options.action, shortcuts);

		if(utils.isMac()) {
			el.title = el.title.replace("Ctrl", "⌘");
			el.title = el.title.replace("Alt", "⌥");
		}
	}

	el.tabIndex = -1;
	el.className = options.className;
	return el;
}

const createSep = () => {
	let el = document.createElement("i");
	el.className = "separator";
	el.innerHTML = "|";
	return el;
}

const createTootlip = (title, action, shortcuts) => {
	if(!action) return title
	const actionName = bindings.find(bindingName => bindingName === action)
	if(!shortcuts[actionName]) return title

	return `${title} ( ${utils.fixShortcut(shortcuts[actionName])} )`
}

/**
 * Interface of SimpleMDE.
 */
class SimpleMDE extends Action {
	constructor(options = {}) {
		super()

		// Used later to refer to it"s parent
		options.parent = this;

		// Check if Font Awesome needs to be auto downloaded
		utils.downloadFA(options)

		// Find the textarea to use
		if(options.element) this.element = options.element;
		if(options.element === null) {
			// This means that the element option was specified, but no element was found
			return console.log("SimpleMDE: Error. No element was found.");
		}

		// Handle toolbar
		if(options.toolbar === undefined) {
			// Initialize
			options.toolbar = [];

			// Loop over the built in buttons, to get the preferred order
			for(const key in toolbarBuiltInButtons) {
				if(toolbarBuiltInButtons.hasOwnProperty(key)) {
					if(key.indexOf("separator-") != -1) {
						options.toolbar.push("|");
					}

					if(toolbarBuiltInButtons[key].default === true || (options.showIcons && options.showIcons.constructor === Array && options.showIcons.indexOf(key) != -1)) {
						options.toolbar.push(key);
					}
				}
			}
		}

		// Handle status bar
		if(!options.hasOwnProperty("status")) {
			options.status = ["autosave", "lines", "words", "cursor"];
		}

		// Add default preview rendering function
		if(!options.previewRender) {
			// Note: "this" refers to the options object
			options.previewRender = plainText => options.parent.markdown(plainText)
		}

		// Set default options for parsing config
		options.parsingConfig = Object.assign({
			highlightFormatting: true // needed for toggleCodeBlock to detect types of code
		}, options.parsingConfig || {});

		// Merging the insertTexts, with the given options
		options.insertTexts = Object.assign({}, insertTexts, options.insertTexts || {});

		// Merging the promptTexts, with the given options
		options.promptTexts = promptTexts;

		// Merging the blockStyles, with the given options
		options.blockStyles = Object.assign({}, blockStyles, options.blockStyles || {});

		// Merging the shortcuts, with the given options
		options.shortcuts = Object.assign({}, shortcuts, options.shortcuts || {});

		// Change unique_id to uniqueId for backwards compatibility
		if(options.autosave != undefined && options.autosave.unique_id != undefined && options.autosave.unique_id != "")
			options.autosave.uniqueId = options.autosave.unique_id;

		// Update this options
		this.options = options;

		// Auto render
		this.render();

		// The codemirror component is only available after rendering
		// so, the setter for the initialValue can only run after
		// the element has been rendered
		if(options.initialValue && (!this.options.autosave || this.options.autosave.foundSavedValue !== true)) {
			this.value(options.initialValue);
		}
	}

	/**
	 * Default markdown render.
	 */
	markdown(text) {
		if(marked) {
			// Update options
			const update = this.options && this.options.renderingConfig && this.options.renderingConfig.singleLineBreaks === false
			const highlight = this.options && this.options.renderingConfig && this.options.renderingConfig.codeSyntaxHighlighting === true && window.hljs

			// Set options
			marked.setOptions({
				breaks: !update,
				highlight: highlight ? code => window.hljs.highlightAuto(code).value : undefined
			});
			return marked(text);
		}
	};

	/**
	 * Render editor to the given element.
	 */
	render(el = this.element || document.getElementsByTagName("textarea")[0]) {
		// Already rendered.
		if(this._rendered && this._rendered === el) return;

		this.element = el;
		const options = this.options;
		let keyMaps = {};

		for(const key in options.shortcuts) {
			// null stands for "do not bind this command"
			const isExistent = bindings.find(bindingName => bindingName === key)
			if(options.shortcuts[key] !== null && isExistent) {
				keyMaps[utils.fixShortcut(options.shortcuts[key])] = () => super[key](this);
			}
		}

		keyMaps["Enter"] = "newlineAndIndentContinueMarkdownList";
		keyMaps["Tab"] = "tabAndIndentMarkdownList";
		keyMaps["Shift-Tab"] = "shiftTabAndUnindentMarkdownList";
		keyMaps["Esc"] = cm => cm.getOption("fullScreen") && super.toggleFullScreen(this);

		document.addEventListener("keydown", (e = window.event) => {
			if(e.keyCode == 27) {
				if(this.codemirror.getOption("fullScreen")) super.toggleFullScreen(this);
			}
		}, false);

		let mode, backdrop;
		if(options.spellChecker !== false) {
			mode = "spell-checker";
			backdrop = options.parsingConfig;
			backdrop.name = "gfm";
			backdrop.gitHubSpice = false;

			CodeMirrorSpellChecker({
				codeMirrorInstance: CodeMirror
			});
		} else {
			mode = options.parsingConfig;
			mode.name = "gfm";
			mode.gitHubSpice = false;
		}

		this.codemirror = CodeMirror.fromTextArea(el, {
			mode: mode,
			backdrop: backdrop,
			theme: "paper",
			tabSize: (options.tabSize != undefined) ? options.tabSize : 2,
			indentUnit: (options.tabSize != undefined) ? options.tabSize : 2,
			indentWithTabs: !(options.indentWithTabs === false),
			lineNumbers: false,
			autofocus: options.autofocus === true,
			extraKeys: keyMaps,
			lineWrapping: !(options.lineWrapping === false),
			allowDropFileTypes: ["text/plain"],
			placeholder: options.placeholder || el.getAttribute("placeholder") || "",
			styleSelectedText: (options.styleSelectedText != undefined) ? options.styleSelectedText : true
		});

		if(options.forceSync === true) {
			this.codemirror.on("change", () => this.codemirror.save());
		}

		this.gui = {};

		if(options.toolbar !== false) {
			this.gui.toolbar = this.createToolbar();
		}
		if(options.status !== false) {
			this.gui.statusbar = this.createStatusbar();
		}
		if(options.autosave != undefined && options.autosave.enabled === true) {
			this.autosave();
		}

		this.gui.sideBySide = this.createSideBySide();
		this._rendered = this.element;

		// Fixes CodeMirror bug (#344)
		setTimeout(() => {
			this.codemirror.refresh();
		}, 0);
	};


	autosave() {
		if(!utils.isLocalStorageAvailable()) {
			return console.log("SimpleMDE: localStorage not available, cannot autosave")
		}

		if(this.options.autosave.uniqueId == undefined || this.options.autosave.uniqueId == "") {
			return console.log("SimpleMDE: You must set a uniqueId to use the autosave feature");
		}

		if(this.element.form != null && this.element.form != undefined) {
			this.element.form.addEventListener("submit", () => {
				localStorage.removeItem("smde_" + this.options.autosave.uniqueId);
			});
		}

		if(this.options.autosave.loaded !== true) {
			if(typeof localStorage.getItem("smde_" + this.options.autosave.uniqueId) == "string" && localStorage.getItem("smde_" + this.options.autosave.uniqueId) != "") {
				this.codemirror.setValue(localStorage.getItem("smde_" + this.options.autosave.uniqueId));
				this.options.autosave.foundSavedValue = true;
			}

			this.options.autosave.loaded = true;
		}

		localStorage.setItem("smde_" + this.options.autosave.uniqueId, this.value());

		let el = document.getElementById("autosaved");
		if(el != null && el != undefined && el != "") {
			const d = new Date();
			const hh = d.getHours();
			const mm = d.getMinutes();

			// date format, output example: Autosaved: 5:45 pm
			const dd = hh >= 12 ? 'pm' : 'am'
			const h = hh == 0 ? 12 : hh > 12 ? hh - 12 : hh;
			const m = mm < 10 ? `0${mm}` : mm;

			el.innerHTML = `Autosaved: ${h}:${m} ${dd}`;
		}

		this.autosaveTimeoutId = setTimeout(() => {
			this.autosave();
		}, this.options.autosave.delay || 10000);
	};

	clearAutosavedValue() {
		if(utils.isLocalStorageAvailable()) {
			if(this.options.autosave == undefined || this.options.autosave.uniqueId == undefined || this.options.autosave.uniqueId == "") {
				return console.log("SimpleMDE: You must set a uniqueId to clear the autosave value");
			}
			localStorage.removeItem("smde_" + this.options.autosave.uniqueId);
		} else {
			console.log("SimpleMDE: localStorage not available, cannot autosave");
		}
	};

	createSideBySide() {
		let cm = this.codemirror;
		let wrapper = cm.getWrapperElement();
		let preview = wrapper.nextSibling;
		const notCreate = !preview || !/editor-preview-side/.test(preview.className)

		if(notCreate) {
			preview = document.createElement("div");
			preview.className = "editor-preview-side";
			wrapper.parentNode.insertBefore(preview, wrapper.nextSibling);
		}

		// Syncs scroll  editor -> preview
		let cScroll = false;
		let pScroll = false;
		cm.on("scroll", v => {
			if(cScroll) return cScroll = false;
			pScroll = true;
			const height = v.getScrollInfo().height - v.getScrollInfo().clientHeight;
			const ratio = parseFloat(v.getScrollInfo().top) / height;
			preview.scrollTop = (preview.scrollHeight - preview.clientHeight) * ratio;
		});

		// Syncs scroll  preview -> editor
		preview.onscroll = () => {
			if(pScroll) return pScroll = false;
			cScroll = true;
			const height = preview.scrollHeight - preview.clientHeight;
			const ratio = parseFloat(preview.scrollTop) / height;
			const move = (cm.getScrollInfo().height - cm.getScrollInfo().clientHeight) * ratio;
			cm.scrollTo(0, move);
		};
		return preview;
	};

	createToolbar(items = this.options.toolbar) {
		if(!items || items.length === 0) return;
		const isExistent = value => toolbarBuiltInButtons[value] != undefined
		this.toolbar = items.map(v => isExistent(v) ? toolbarBuiltInButtons[v] : v)

		let bar = document.createElement("div");
		let toolbarData = {};
		const nextLoop = (v, i) => {
			const name = v.name
			if(name == "guide" && this.options.toolbarGuideIcon === false) return true;
			if(this.options.hideIcons && this.options.hideIcons.indexOf(name) != -1) return true;

			// Fullscreen does not work well on mobile devices (even tablets)
			// In the future, hopefully this can be resolved
			if((name == "fullscreen" || name == "side-by-side") && utils.isMobile()) return true;

			// Don't include trailing separators
			if(v === "|") {
				let nonSeparatorIconsFollow = true;
				for(let x = (i + 1); x < this.toolbar.length; x++) {
					if(this.toolbar[x] !== "|" && (!this.options.hideIcons || this.options.hideIcons.indexOf(name) == -1)) {
						nonSeparatorIconsFollow = false;
					}
				}
				if(nonSeparatorIconsFollow) return true
			}
			return false
		}
		const createElement = v => {
			if(v === "|") return createSep();
			return createIcon(v, this.options.toolbarTips, this.options.shortcuts)
		}

		this.toolbar.forEach((v, i) => {
			if(nextLoop(v, i)) return;

			// Create the icon and append to the toolbar
			const el = createElement(v)
			const isCustomMethods = typeof v.action === "function"

			// bind events, special for info
			if(v.action) {
				el.onclick = e => {
					e.preventDefault();
					isCustomMethods ? v.action(this) : super[v.action](this)
				};
			}

			toolbarData[v.name || v] = el;
			bar.appendChild(el);
		})
		this.toolbarElements = toolbarData;
		this.codemirror.on("cursorActivity", () => {
			const stat = base.getState(this.codemirror);
			for(const key in toolbarData) {
				let el = toolbarData[key];
				if(stat[key]) {
					el.className += " active";
				} else if(key != "fullscreen" && key != "side-by-side") {
					el.className = el.className.replace(/\s*active\s*/g, "");
				}
			}
		});

		const cmWrapper = this.codemirror.getWrapperElement();

		bar.className = "editor-toolbar";
		cmWrapper.parentNode.insertBefore(bar, cmWrapper);
		return bar;
	};

	createStatusbar(status = this.options.status) {
		// Make sure the status variable is valid
		if(!status || status.length === 0) return;

		const options = this.options;
		const cm = this.codemirror;

		// Set up the built-in items
		let items = [];
		let bar = document.createElement("div");
		bar.className = "editor-statusbar";

		const statusFuncMap = {
			words: {
				defaultValue: el => el.innerHTML = utils.wordCount(cm.getValue()),
				onUpdate: el => el.innerHTML = utils.wordCount(cm.getValue())
			},
			lines: {
				defaultValue: el => el.innerHTML = cm.lineCount(),
				onUpdate: el => el.innerHTML = cm.lineCount()
			},
			cursor: {
				defaultValue: el => el.innerHTML = "0:0",
				onUpdate: el => el.innerHTML = cm.getCursor().line + ":" + cm.getCursor().ch
			},
			autosave: {
				defaultValue: el => {
					if(options.autosave != undefined && options.autosave.enabled === true) {
						el.setAttribute("id", "autosaved");
					}
				},
				onUpdate: undefined
			}
		}

		status.forEach(v => {
			if(typeof v === "object") {
				items.push({
					className: v.className,
					defaultValue: v.defaultValue,
					onUpdate: v.onUpdate
				})
			}
			if(statusFuncMap[v]) {
				items.push({
					className: v.toString(),
					defaultValue: statusFuncMap[v].defaultValue,
					onUpdate: statusFuncMap[v].onUpdate
				})
			}
		})


		// Create element for the status bar
		const createStatusElement = className => {
			let el = document.createElement("span");
			el.className = className
			return el
		}
		items.forEach(v => {
			const el = createStatusElement(v.className)
			if(typeof v.defaultValue === "function") v.defaultValue(el)
			if(typeof v.onUpdate === "function") {
				// Create a closure around the span of the current action, then execute the onUpdate handler
				this.codemirror.on("update", () => v.onUpdate(el));
			}

			// Append the item to the status bar
			bar.appendChild(el);
		})

		// Insert the status bar into the DOM
		let cmWrapper = this.codemirror.getWrapperElement();
		cmWrapper.parentNode.insertBefore(bar, cmWrapper.nextSibling);
		return bar;
	};

	/**
	 * Get or set the text content.
	 */
	value(val) {
		if(val === undefined) return this.codemirror.getValue();
		this.codemirror.getDoc().setValue(val);
		return this;
	};

	/**
	 * Bind instance methods for exports.
	 */


	isPreviewActive() {
		const wrapper = this.codemirror.getWrapperElement();
		const preview = wrapper.lastChild;

		return /editor-preview-active/.test(preview.className);
	};

	isSideBySideActive() {
		const wrapper = this.codemirror.getWrapperElement();
		const preview = wrapper.nextSibling;

		return /editor-preview-active-side/.test(preview.className);
	};

	isFullscreenActive() {
		return this.codemirror.getOption("fullScreen");
	};

	getState() {
		return base.getState(this.codemirror);
	};

	toTextArea() {
		const wrapper = this.codemirror.getWrapperElement();

		if(wrapper.parentNode) {
			if(this.gui.toolbar) {
				wrapper.parentNode.removeChild(this.gui.toolbar);
			}
			if(this.gui.statusbar) {
				wrapper.parentNode.removeChild(this.gui.statusbar);
			}
			if(this.gui.sideBySide) {
				wrapper.parentNode.removeChild(this.gui.sideBySide);
			}
		}

		this.codemirror.toTextArea();

		if(this.autosaveTimeoutId) {
			clearTimeout(this.autosaveTimeoutId);
			this.autosaveTimeoutId = undefined;
			this.clearAutosavedValue();
		}
	};
}
export default SimpleMDE