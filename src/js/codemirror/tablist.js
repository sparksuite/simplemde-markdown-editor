// CodeMirror, copyright (c) by Marijn Haverbeke and others
// Distributed under an MIT license: http://codemirror.net/LICENSE
import CodeMirror from 'CodeMirror'

CodeMirror.commands.tabAndIndentMarkdownList = cm =>{
	const ranges = cm.listSelections();
	const pos = ranges[0].head;
	const eolState = cm.getStateAfter(pos.line);
	const inList = eolState.list !== false;

	if (inList) return cm.execCommand("indentMore");

	if (cm.options.indentWithTabs) return cm.execCommand("insertTab");
	cm.replaceSelection(Array(cm.options.tabSize + 1).join(" "));
};

CodeMirror.commands.shiftTabAndUnindentMarkdownList = function (cm) {
	const ranges = cm.listSelections();
	const pos = ranges[0].head;
	const eolState = cm.getStateAfter(pos.line);
	const inList = eolState.list !== false;

	if (inList) return cm.execCommand("indentLess");

	if (cm.options.indentWithTabs) return cm.execCommand("insertTab");
	cm.replaceSelection(Array(cm.options.tabSize + 1).join(" "));
};
