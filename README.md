# Markdownify - Markdown Editor
A drop-in JavaScript textarea replacement for writing beautiful and understandable markdown. The WYSIWYG-esque editor allows you to modify the markdown with toolbar buttons and shortcuts. It has been designed to be easy to use by users who are less technical.

![Preview](http://i.imgur.com/l5antiW.png)

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

## How it works
Markdownify is an improvement of [lepture's Editor project](https://github.com/lepture/editor) and includes a great many number of changes. It is bundled with [CodeMirror](https://github.com/codemirror/codemirror) and [Font Awesome](http://fortawesome.github.io/Font-Awesome/).

CodeMirror is the backbone of the project and parses much of the markdown syntax as it's being written. This allows us to add styles to the markdown that's being written. Additionally, a toolbar and statusbar has been added to the top and bottom, respectively. Previews are rendered by [Marked](https://github.com/chjj/marked).

## What's changed?
As mentioned earlier, Markdownify is an improvement of [lepture's Editor project](https://github.com/lepture/editor). So you might be wondering, what's changed? Quite a bit actually. Here's some notable changes:

- Upgraded from CodeMirror 3 to CodeMirror 5
- Many changes to the style, appearance, and userfriendliness
- Interface more closely resembles Bootstrap
- Now mobile friendly
- The text editor now automatically grows as you type more
- Fixed a large amount of bugs
- Switched to Font Awesome icons
- Improved preview rendering in many ways
- Improved as-you-type appearance of headers and code blocks
- Simplified the toolbar
