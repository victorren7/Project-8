'use strict'

//devdependencies & dependecies
const gulp   	    = require('gulp');
const concat 	    = require('gulp-concat');
const uglify 	    = require('gulp-uglify');
const rename 	    = require('gulp-rename');
const sass        = require('gulp-sass');
const cleanCSS    = require('gulp-clean-css');
const srcMaps     = require('gulp-sourcemaps');
const imagemin    = require('gulp-imagemin');
const runSec      = require('run-sequence');
const browserSync = require('browser-sync').create();
const del         = require('del');
const connect       = require("gulp-connect");


//concatanate js files and saves them in files
gulp.task("scripts", function() {
	return gulp.src([
		"js/circle/circle.js",
		"js/circle/autogrow.js",
		"js/global.js"])
		.pipe(srcMaps.init())
		.pipe(concat('all.js'))
		.pipe(uglify())
		.pipe(rename('all.js.min.js'))
		.pipe(srcMaps.write('./'))
		.pipe(gulp.dest('dist/scripts'))
});

gulp.task("styles", function() {
  return gulp.src('sass/global.scss')
  .pipe(srcMaps.init())
  .pipe(sass())
  .pipe(cleanCSS({compatibility: 'ie8'}))
  .pipe(rename('all.js.min.css'))
  .pipe(srcMaps.write('./'))
  .pipe(gulp.dest('dist/styles'))
  .pipe(browserSync.reload({
      stream: true
    }))
});

//minimizes images. lines 43-55 are put in dist/content folder
gulp.task("images",function() {
	return gulp.src('images/*')
		.pipe(imagemin())
		.pipe(gulp.dest('dist/content'));
});

gulp.task("moveIndex", function() {
	return gulp.src(['index.html'])
	.pipe(gulp.dest('dist/'))
});

gulp.task("moveIcons", function() {
	return gulp.src(['icon/*'], { base: './'})
	.pipe(gulp.dest('dist'))
});

//deletes all folders in dist
gulp.task("clean", function() {
	return del(['dist/**']);
});

//run tasks in sequence
gulp.task("build", function() {
  runSec("clean", ["scripts","styles","moveIndex","moveIcons","images"], "watch");
});


//sets up server and watches for the changes
gulp.task("browserSync", function() {
	browserSync.init({ server: { baseDir: './dist'}, })
})

//watches for changes in scss
gulp.task('watch', ['browserSync', 'styles'], function (){
	gulp.watch('sass/**.scss', ['styles']);
})


//run localhost:3000
gulp.task("default", ["build"], function() {
  connect.server({port: 3000});

});
