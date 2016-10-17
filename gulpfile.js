/*
Copyright (c) 2015 The Polymer Project Authors. All rights reserved.
This code may only be used under the BSD style license found at http://polymer.github.io/LICENSE.txt
The complete set of authors may be found at http://polymer.github.io/AUTHORS.txt
The complete set of contributors may be found at http://polymer.github.io/CONTRIBUTORS.txt
Code distributed by Google as part of the polymer project is also
subject to an additional IP rights grant found at http://polymer.github.io/PATENTS.txt
*/

'use strict';


/**
 * MODULES
 */

var gulp = require('gulp');
var del = require('del');
var path = require('path');
var $ = require('gulp-load-plugins')();
var sass = require('gulp-sass');
var htmlmin = require('gulp-htmlmin');
var postcss = require('gulp-postcss');
var autoprefixer = require('autoprefixer');
var runSequence = require('run-sequence');


/**
 * SASS TASK
 */

gulp.task('sass', function(){
  return gulp.src('scss/**/*.scss')
    .pipe(sass())
    .on('error', sass.logError)
    .pipe(postcss([
      autoprefixer({
        browsers: ['last 2 versions', '> 5%'],
        cascade: false
      })
    ]))
    .pipe(gulp.dest('css'))
});


/**
 * BUILD TASK
 */

gulp.task('copy-bower', function() {
  return gulp.src(['./bower_components/**/*'])
    .pipe(gulp.dest('./.tmp'))
    .pipe($.size({ title: 'bower' }));
});

gulp.task('copy-components', function() {
  return gulp.src(['./*.html', '!index.html', '!elements.html'])
    .pipe(gulp.dest('.tmp/components/'))
    .pipe($.size({ title: 'components' }));
});

gulp.task('copy-css', function() {
  return gulp.src([ './css/**/*.css'])
    .pipe(gulp.dest('.tmp/components/css/'))
    .pipe($.size({ title: 'css' }));
});

gulp.task('vulcanize', function() {
  return gulp.src(['.tmp/components/*.html'])
    .pipe($.vulcanize({
      inlineCss: true,
      inlineScripts: true,
      stripExcludes: false,
      excludes: [
        '.tmp/polymer/polymer.html']
    }))
    .pipe(gulp.dest('dist/components'))
    .pipe($.size({title: 'vulcanize'}));
});

gulp.task('copy-polymer', function() {
  return gulp.src(['./bower_components/polymer/**/*'])
    .pipe(gulp.dest('dist/polymer'))
    .pipe($.size({ title: 'polymer' }));
});

gulp.task('copy-promise', function() {
  return gulp.src(['./bower_components/promise-polyfill/**/*'])
    .pipe(gulp.dest('dist/promise-polyfill'))
    .pipe($.size({ title: 'promise' }));
});

gulp.task('copy-webcomponents', function() {
  return gulp.src(['./bower_components/webcomponentsjs/**/*'])
    .pipe(gulp.dest('dist/webcomponentsjs'))
    .pipe($.size({ title: 'webcomponents' }));
});

gulp.task('minify', function() {
  return gulp.src('dist/components/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
      removeComments: true,
      minifyCSS: true,
      minifyJS: true
    }))
    .pipe(gulp.dest('dist/components'))
});

gulp.task('clean', function() {
  return del(['.tmp']);
});


/**
 * COMMANDS
 */

gulp.task('default', function() {
  gulp.watch('scss/**/*.scss', ['sass']);
});

gulp.task('build', function() {
  runSequence(
    'copy-bower',
    'copy-components',
    'copy-css',
    'vulcanize',
    'copy-polymer',
    'copy-promise',
    'copy-webcomponents',
    'minify',
    'clean');
});
