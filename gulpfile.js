const gulp      = require('gulp');
const less      = require('gulp-less');
const concat    = require('gulp-concat');
const cssmin    = require('gulp-cssmin');
const rename    = require('gulp-rename');
const minify    = require('gulp-minify');
const jslint    = require('gulp-jslint');



gulp.task('default', ['build', 'watch']);

gulp.task('watch', function() {
    gulp.watch(['assets/styles/**/*.less'], ['less']);
    gulp.watch(['assets/scripts/**/*.js'], ['js']);
});

gulp.task('build', [
    'vendor-css',
    'vendor-js',
    'vendor-fonts',
    'images',
    'less',
    'js'], function(){
});

gulp.task('images', function() {
    return gulp
        .src([
            'assets/images/**/*.png',
            'assets/images/**/*.jpg',
            'assets/images/**/*.gif'
        ])
        .pipe(gulp.dest('build/images'))
});

gulp.task('less', function() {
    return gulp.src('assets/styles/*.less')
        .pipe(less())
        .pipe(cssmin())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('build/css'));
});

gulp.task('js', function(){
    return gulp
        .src([
            'assets/scripts/**/*.js'
        ])
        .pipe(jslint())
        .pipe(minify({
            ext: {
                min: '.min.js'
            }
        }))
        .pipe(gulp.dest('build/js'));
});

// Consolidate 3rd-party vendor libraries
gulp.task('vendor-css', function(){

    const VENDOR_CSS_FILES = [
        'node_modules/semantic-ui-css/semantic.css',
        'node_modules/leaflet/dist/leaflet.css',
        'node_modules/leaflet.markercluster/dist/MarkerCluster.css',
        'node_modules/leaflet.markercluster/dist/MarkerCluster.Default.css'
    ];

    return gulp
        .src(VENDOR_CSS_FILES)
        .pipe(concat('vendor.css'))
        .pipe(cssmin())
        .pipe(rename('vendor.min.css'))
        .pipe(gulp.dest('build/css'));
});

gulp.task('vendor-js', function(){

    const VENDOR_JS_FILES = [
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/semantic-ui-css/semantic.js',
        'node_modules/vue/dist/vue.js',
        'node_modules/lodash/core.js',
        'node_modules/leaflet/dist/leaflet.js',
        'node_modules/leaflet.markercluster/dist/leaflet.markercluster.js',
        'node_modules/d3/build/d3.js'
    ];

    return gulp
        .src(VENDOR_JS_FILES)
        .pipe(concat('bundle.js'))
        .pipe(minify())
        .pipe(rename('vendor.min.js'))
        .pipe(gulp.dest('build/js'));
});

gulp.task('vendor-fonts', function() {
    return gulp
        .src([
            'node_modules/semantic-ui/dist/themes/default/assets/fonts/*'
        ])
        .pipe(gulp.dest('build/css/themes/default/assets/fonts'))
});
