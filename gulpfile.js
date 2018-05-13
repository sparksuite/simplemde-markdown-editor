'use strict';

var gulp = require('gulp');
var cleanCSS = require('gulp-clean-css');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var header = require('gulp-header');
var buffer = require('vinyl-buffer');
var pkg = require('./package.json');
var eslint = require('gulp-eslint');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var rename = require('gulp-rename');

var banner = ['/**',
    ' * <%= pkg.name %> v<%= pkg.version %>',
    ' * Copyright <%= pkg.author %>',
    ' * @link <%= pkg.repository.url %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''].join('\n');

function lint() {
    return gulp.src('./src/js/**/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
}

function scripts() {
    return browserify({entries: './src/js/easymde.js', standalone: 'EasyMDE'}).bundle()
        .pipe(source('easymde.min.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(header(banner, {pkg: pkg}))
        .pipe(gulp.dest('./dist/'));
}

function styles() {
    var css_files = [
        './node_modules/codemirror/lib/codemirror.css',
        './src/css/*.css',
        './node_modules/codemirror-spell-checker/src/css/spell-checker.css'
    ];

    return gulp.src(css_files)
        .pipe(concat('easymde.css'))
        .pipe(cleanCSS())
        .pipe(rename('easymde.min.css'))
        .pipe(buffer())
        .pipe(header(banner, {pkg: pkg}))
        .pipe(gulp.dest('./dist/'));
}

var build = gulp.parallel(gulp.series(lint, scripts), styles);

gulp.task('default', build);
