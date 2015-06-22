# Markdownify - Markdown Editor
A drop-in JavaScript textarea replacement for writing beautiful and understandable markdown. The WYSIWYG-esque editor allows you to modify the markdown with toolbar buttons and shortcuts. It has been designed to be easy to use by users who are less technical.

![Preview](http://i.imgur.com/l5antiW.png)

## How it works
Markdownify is an improvement of [lepture's Editor project](https://github.com/lepture/editor) and includes a great many number of changes. It is bundled with [CodeMirror](https://github.com/codemirror/codemirror) and [Font Awesome](http://fortawesome.github.io/Font-Awesome/).

## Quickstart

```
<link rel="stylesheet" href="/PATH/TO/markdownify.min.css">
<script src="/PATH/TO/markdownify.min.js"></script>
```

And then load Markdownify on the first textarea on a page

```
var markdownify = new Markdownify();
markdownify.render();
```

#### Use a specific textarea

Pure JavaScript method

```
var markdownify = new Markdownify(document.getElementById("MyID"));
markdownify.render();
```

jQuery method

```
var markdownify = new Markdownify($("#MyID")[0]);
markdownify.render();
```

## Get the content

```
markdownify.codemirror.getValue();
```

## Configuration

- **element**: The DOM element for the textarea to use. Defaults to the first textarea on the page.
- **status**: If set false, hide the statusbar. Defaults to true.
- **tools**: If set false, hide the toolbar. Defaults to true.

```
new Markdownify({
  element: document.getElementById("MyID"),
  status: false,
  tools: false,
});
```
