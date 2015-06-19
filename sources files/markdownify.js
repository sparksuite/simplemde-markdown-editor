var toolbar = [
  {name: 'bold', action: toggleBold, className: "fa fa-bold"},
  {name: 'italic', action: toggleItalic, className: "fa fa-italic"},
  '|',

  {name: 'quote', action: toggleBlockquote, className: "fa fa-quote-left"},
  {name: 'unordered-list', action: toggleUnOrderedList, className: "fa fa-list-ul"},
  {name: 'ordered-list', action: toggleOrderedList, className: "fa fa-list-ol"},
  '|',

  {name: 'link', action: drawLink, className: "fa fa-link"},
  {name: 'image', action: drawImage, className: "fa fa-picture-o"},
  '|',

  {name: 'preview', action: togglePreview, className: "fa fa-eye"},
];

/**
 * Interface of Markdownify.
 */
function Markdownify(options) {
  options = options || {};

  if (options.element) {
	this.element = options.element;
  }

  options.toolbar = options.toolbar || Markdownify.toolbar;
  // you can customize toolbar with object
  // [{name: 'bold', shortcut: 'Ctrl-B', className: 'icon-bold'}]

  if (!options.hasOwnProperty('status')) {
	options.status = ['lines', 'words', 'cursor'];
  }

  this.options = options;

  // If user has passed an element, it should auto rendered
  if (this.element) {
	this.render();
  }
}

/**
 * Default toolbar elements.
 */
Markdownify.toolbar = toolbar;

/**
 * Default markdown render.
 */
Markdownify.markdown = function(text) {
  if (window.marked) {
	// use marked as markdown parser
	return marked(text);
  }
};

/**
 * Render editor to the given element.
 */
Markdownify.prototype.render = function(el) {
  if (!el) {
	el = this.element || document.getElementsByTagName('textarea')[0];
  }

  if (this._rendered && this._rendered === el) {
	// Already rendered.
	return;
  }

  this.element = el;
  var options = this.options;

  var self = this;
  var keyMaps = {};

  for (var key in shortcuts) {
	(function(key) {
	  keyMaps[fixShortcut(key)] = function(cm) {
		shortcuts[key](self);
	  };
	})(key);
  }

  keyMaps["Enter"] = "newlineAndIndentContinueMarkdownList";
  keyMaps['Tab'] = 'tabAndIndentContinueMarkdownList';
  keyMaps['Shift-Tab'] = 'shiftTabAndIndentContinueMarkdownList';

  this.codemirror = CodeMirror.fromTextArea(el, {
	mode: 'markdown',
	theme: 'paper',
	tabSize: '2',
	indentWithTabs: true,
	lineNumbers: false,
	autofocus: false,
	extraKeys: keyMaps,
	lineWrapping: true
  });

  if (options.toolbar !== false) {
	this.createToolbar();
  }
  if (options.status !== false) {
	this.createStatusbar();
  }

  this._rendered = this.element;
};

Markdownify.prototype.createToolbar = function(items) {
  items = items || this.options.toolbar;

  if (!items || items.length === 0) {
	return;
  }

  var bar = document.createElement('div');
  bar.className = 'editor-toolbar';

  var self = this;

  var el;
  self.toolbar = {};

  for (var i = 0; i < items.length; i++) {
	(function(item) {
	  var el;
	  if (item.name) {
		el = createIcon(item.name, item);
	  } else if (item === '|') {
		el = createSep();
	  } else {
		el = createIcon(item);
	  }

	  // bind events, special for info
	  if (item.action) {
		if (typeof item.action === 'function') {
		  el.onclick = function(e) {
			item.action(self);
		  };
		} else if (typeof item.action === 'string') {
		  el.href = item.action;
		  el.target = '_blank';
		}
	  }
	  self.toolbar[item.name || item] = el;
	  bar.appendChild(el);
	})(items[i]);
  }

  var cm = this.codemirror;
  cm.on('cursorActivity', function() {
	var stat = getState(cm);

	for (var key in self.toolbar) {
	  (function(key) {
		var el = self.toolbar[key];
		if (stat[key]) {
		  el.className += ' active';
		} else {
		  el.className = el.className.replace(/\s*active\s*/g, '');
		}
	  })(key);
	}
  });

  var cmWrapper = cm.getWrapperElement();
  cmWrapper.parentNode.insertBefore(bar, cmWrapper);
  return bar;
};

Markdownify.prototype.createStatusbar = function(status) {
  status = status || this.options.status;

  if (!status || status.length === 0) return;

  var bar = document.createElement('div');
  bar.className = 'editor-statusbar';

  var pos, cm = this.codemirror;
  for (var i = 0; i < status.length; i++) {
	(function(name) {
	  var el = document.createElement('span');
	  el.className = name;
	  if (name === 'words') {
		el.innerHTML = '0';
		cm.on('update', function() {
		  el.innerHTML = wordCount(cm.getValue());
		});
	  } else if (name === 'lines') {
		el.innerHTML = '0';
		cm.on('update', function() {
		  el.innerHTML = cm.lineCount();
		});
	  } else if (name === 'cursor') {
		el.innerHTML = '0:0';
		cm.on('cursorActivity', function() {
		  pos = cm.getCursor();
		  el.innerHTML = pos.line + ':' + pos.ch;
		});
	  }
	  bar.appendChild(el);
	})(status[i]);
  }
  var cmWrapper = this.codemirror.getWrapperElement();
  cmWrapper.parentNode.insertBefore(bar, cmWrapper.nextSibling);
  return bar;
};

/**
 * Get or set the text content.
 */
Markdownify.prototype.value = function(val) {
  if (val) {
	this.codemirror.getDoc().setValue(val);
	return this;
  } else {
	return this.codemirror.getValue();
  }
};


/**
 * Bind static methods for exports.
 */
Markdownify.toggleBold = toggleBold;
Markdownify.toggleItalic = toggleItalic;
Markdownify.toggleBlockquote = toggleBlockquote;
Markdownify.toggleUnOrderedList = toggleUnOrderedList;
Markdownify.toggleOrderedList = toggleOrderedList;
Markdownify.drawLink = drawLink;
Markdownify.drawImage = drawImage;
Markdownify.undo = undo;
Markdownify.redo = redo;
Markdownify.togglePreview = togglePreview;
Markdownify.toggleFullScreen = toggleFullScreen;

/**
 * Bind instance methods for exports.
 */
Markdownify.prototype.toggleBold = function() {
  toggleBold(this);
};
Markdownify.prototype.toggleItalic = function() {
  toggleItalic(this);
};
Markdownify.prototype.toggleBlockquote = function() {
  toggleBlockquote(this);
};
Markdownify.prototype.toggleUnOrderedList = function() {
  toggleUnOrderedList(this);
};
Markdownify.prototype.toggleOrderedList = function() {
  toggleOrderedList(this);
};
Markdownify.prototype.drawLink = function() {
  drawLink(this);
};
Markdownify.prototype.drawImage = function() {
  drawImage(this);
};
Markdownify.prototype.undo = function() {
  undo(this);
};
Markdownify.prototype.redo = function() {
  redo(this);
};
Markdownify.prototype.togglePreview = function() {
  togglePreview(this);
};
Markdownify.prototype.toggleFullScreen = function() {
  toggleFullScreen(this);
};