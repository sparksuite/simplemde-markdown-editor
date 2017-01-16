import babelify from 'babelify'
import gulp from 'gulp'
import minifycss from 'gulp-clean-css'
import uglify from 'gulp-uglify'
import concat from 'gulp-concat'
import header from 'gulp-header'
import buffer from 'vinyl-buffer'
import pkg from './package.json'
import debug from 'gulp-debug'
import eslint from 'gulp-eslint'
import prettify from 'gulp-jsbeautifier'
import browserify from 'browserify'
import source from 'vinyl-source-stream'
import rename from 'gulp-rename'

const banner = `/**
 * <%= pkg.name %> v<%= pkg.version %>
 * Copyright <%= pkg.company %>
 * @link <%= pkg.homepage %>
 * @license <%= pkg.license %>
 */\n`

gulp.task("prettify-js", [], () =>{
	return gulp.src("./src/js/simplemde.js")
		.pipe(prettify({
			js: {
				brace_style: "collapse",
				indent_char: "\t",
				indent_size: 1,
				max_preserve_newlines: 3,
				space_before_conditional: false
			}}))
		.pipe(gulp.dest("./src/js"));
});
 
gulp.task("prettify-css", [], () =>{
	return gulp.src("./src/css/simplemde.css")
		.pipe(prettify({css: {indentChar: "\t", indentSize: 1}}))
		.pipe(gulp.dest("./src/css"));
});

gulp.task("lint", ["prettify-js"], () =>{
	gulp.src("./src/js/**/*.js")
		.pipe(debug())
		.pipe(eslint())
		.pipe(eslint.format())
		.pipe(eslint.failAfterError());
});

function taskBrowserify(opts) {
	return browserify("./src/js/simplemde.js", opts)
		.transform("babelify", {presets: ['es2015', 'stage-3']})
		.bundle();
}

gulp.task("browserify:debug", ["lint"], () =>{
	return taskBrowserify({debug:true, standalone:"SimpleMDE"})
		.pipe(source("simplemde.debug.js"))
		.pipe(buffer())
		.pipe(header(banner, {pkg: pkg}))
		.pipe(gulp.dest("./debug/"));
});

gulp.task("browserify", ["lint"], () =>{
	return taskBrowserify({standalone:"SimpleMDE"})
		.pipe(source("simplemde.js"))
		.pipe(buffer())
		.pipe(header(banner, {pkg: pkg}))
		.pipe(gulp.dest("./debug/"));
});

gulp.task("scripts", ["browserify:debug", "browserify", "lint"], () =>{
	const js_files = ["./debug/simplemde.js"];
	
	return gulp.src(js_files)
		.pipe(concat("simplemde.min.js"))
		.pipe(uglify())
		.pipe(buffer())
		.pipe(header(banner, {pkg: pkg}))
		.pipe(gulp.dest("./dist/"));
});

gulp.task("styles", ["prettify-css"], () =>{
	const css_files = [
		"./node_modules/codemirror/lib/codemirror.css",
		"./src/css/*.css",
		"./node_modules/codemirror-spell-checker/src/css/spell-checker.css"
	];
	
	return gulp.src(css_files)
		.pipe(concat("simplemde.css"))
		.pipe(buffer())
		.pipe(header(banner, {pkg: pkg}))
		.pipe(gulp.dest("./debug/"))
		.pipe(minifycss())
		.pipe(rename("simplemde.min.css"))
		.pipe(buffer())
		.pipe(header(banner, {pkg: pkg}))
		.pipe(gulp.dest("./dist/"));
});

gulp.task("default", ["scripts", "styles"]);
