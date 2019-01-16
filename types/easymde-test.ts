new EasyMDE({
    autoDownloadFontAwesome: false,
    element: document.getElementById("mdEditor")!,
    hideIcons: ["side-by-side", "fullscreen"],
    shortcuts: {
        drawTable: "Cmd-Alt-T",
        toggleFullScreen: null
    },
    spellChecker: false
});
