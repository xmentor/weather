(function(gulp) {
    'use strict';
    
    const sass = require('gulp-sass');
    const autoprefixer = require('gulp-autoprefixer');
    const cssmin = require('gulp-cssmin');
    const template = require('gulp-template');
    const closureCompiler = require('gulp-closure-compiler');
    const replace = require('gulp-string-replace');
    const copy = require('gulp-copy');

    // sass to css
    gulp.task('sass', function() {
        return gulp.src('src/sass/*.scss')
            .pipe(sass().on('error', sass.logError))
            .pipe(gulp.dest('dest/css'));
    });
    
    // autoprefixe css
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
    
    // template
    gulp.task('template', ['cssmin'], function() {
        return gulp.src('src/index.html')
            .pipe(template({lang: 'en',
                            title: 'Weather',
                            desc: '',
                            css: 'css/weather.css',
                            js: 'js/weather.min.js'})
                 )
            .pipe(gulp.dest('dest'));
    });
    
    // ES6 to ES5
    gulp.task('jsCompiler', ['template'], function() {
        return gulp.src('src/js/weather.js')
            .pipe(closureCompiler({fileName: 'weather.min.js',
                                   compilerFlags: {
                                       compilation_level: 'SIMPLE_OPTIMIZATIONS',
                                       language_in: 'ECMASCRIPT6_STRICT',
                                       language_out: 'ECMASCRIPT5_STRICT'
                                   }
                                  }))
            .pipe(gulp.dest('dest/js'));
    });
    
    // remove whitespace
    gulp.task('replace', ['jsCompiler'], function() {
        return gulp.src(['./dest/js/*.min.js'])
            .pipe(replace(/\\n\s+/g, ''))
            .pipe(gulp.dest('./dest/js'));
    });
    
    // copy images
    gulp.task('default', ['replace'], function() {
       return gulp.src('src/img/**')
           .pipe(copy('dest', {prefix: 1}))
           .pipe(gulp.dest('dest/img'));
    });
    
}(require('gulp')));