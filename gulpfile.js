'use strict';

var gulp = require('gulp'),
    minifycss = require('gulp-clean-css'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    header = require('gulp-header'),
    buffer = require('vinyl-buffer'),
    pkg = require('./package.json'),
    eslint = require('gulp-eslint'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    rename = require('gulp-rename');

var banner = ['/**',
    ' * <%= pkg.name %> v<%= pkg.version %>',
    ' * Copyright <%= pkg.author %>',
    ' * @link <%= pkg.repository.url %>',
    ' * @license <%= pkg.license %>',
    ' */',
    ''].join('\n');

gulp.task('lint', function () {
    gulp.src('./src/js/**/*.js')
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('scripts', ['lint'], function () {
    return browserify({entries: './src/js/simplemde.js', standalone: 'SimpleMDE'}).bundle()
        .pipe(source('simplemde.min.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(header(banner, {pkg: pkg}))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('styles', function () {
    var css_files = [
        './node_modules/codemirror/lib/codemirror.css',
        './src/css/*.css',
        './node_modules/codemirror-spell-checker/src/css/spell-checker.css'
    ];

    return gulp.src(css_files)
        .pipe(concat('simplemde.css'))
        .pipe(minifycss())
        .pipe(rename('simplemde.min.css'))
        .pipe(buffer())
        .pipe(header(banner, {pkg: pkg}))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['scripts', 'styles']);
