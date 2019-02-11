# Contributing

Hey, welcome to the party! 🎉

Thank you so much to contribute to EasyMDE. 😘


## Asking questions, suggesting wonderful ideas or reporting bugs

You can [submit an issue️](https://github.com/Ionaru/easy-markdown-editor/issues/new) on this GitHub repository.


## Coding

### 📦 Prerequies

You need node.js and npm.

To install them on Debian-based systems:

```bash
curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -
sudo apt-get install -y nodejs
echo -e "nodejs version:\t$(nodejs -v) \nnpm version:\t$(npm -v)"
# check that you have node.js and npm.
```

For other systems, please [read the official page](https://nodejs.org/en/download/).


### 🏗️ Installation

Here we go! 🤠 First, clone this repository:

```bash
git clone https://github.com/Ionaru/easy-markdown-editor.git
```

Then install the EasyMDE for development environment with npm:

```bash
npm install --save-dev
```

And check that everything is ok by running Gulp:

```bash
gulp
```

Yay! You are ready! 🍾

### ⤴️ Creating a pull request

- 1. First, [create a fork of this project](https://github.com/Ionaru/easy-markdown-editor/fork), and copy the https URL (*clone or download* button) of your project (something like https://github.com/YOUR_USERNAME/easy-markdown-editor.git );
- 2.a If you already cloned and worked on the project: `git remote add source https://github.com/Ionaru/easy-markdown-editor.git`;
- 2.b otherwise, clone your fork: `git clone https://github.com/YOUR_USERNAME/easy-markdown-editor.git`;
- 3. create a new dedicated branch `git checkout -b myMergeRequest`;
- 4. write some nice code and commit your work;
- 5. check files against the ESLint syntax and build minified versions: `gulp`;
- 6. push it to a dedicated branch `git push origin myMergeRequest`;
- 7. got to the [main project page](https://github.com/Ionaru/easy-markdown-editor) and click on the button *Compare and pull request*, then fill the description.

If you want to make other pull requests, go back to the development branch (`git checkout development`), update it (`git pull --rebase source development`), then follow the instructions above from step 3.

Thank you! 💜
