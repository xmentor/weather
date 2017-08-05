(function(gulp) {
    'use strict';
    
    const sass = require('gulp-sass');
    const autoprefixer = require('gulp-autoprefixer');
    const cssmin = require('gulp-cssmin');
    const replace = require('gulp-string-replace');
    const copy = require('gulp-copy');

    // sass to css
    gulp.task('sass', function() {
        return gulp.src('src/sass/main.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest('dest/css'));
    });
    
    // autoprefixer css
    gulp.task('autoprefixer', ['sass'], function() {
        return gulp.src('dest/css/*.css')
            .pipe(autoprefixer({
                browsers: ['last 2 versions'],
                cascade: false
            }))
            .pipe(gulp.dest('dest/css'));
    });
    
    // minify css
    gulp.task('cssmin', ['autoprefixer'], function() {
        return gulp.src('dest/css/*.css')
            .pipe(cssmin())
            .pipe(gulp.dest('dest/css'));
    });
      
    // remove whitespace
    gulp.task('replace', ['cssmin'], function() {
        return gulp.src(['./dest/js/*.min.js'])
            .pipe(replace(/\\n\s+/g, ''))
            .pipe(gulp.dest('./dest/js'));
    });
    
    // copy images
    gulp.task('default', ['replace'], function() {
       return gulp.src('src/img/**')
           .pipe(copy('dest', {prefix: 1}));
    });
    
}(require('gulp')));