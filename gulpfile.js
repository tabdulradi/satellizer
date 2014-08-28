var gulp = require('gulp');
var concat = require('gulp-concat');
var complexity = require('gulp-complexity');
var plumber = require('gulp-plumber');
var rename = require("gulp-rename");
var uglify = require('gulp-uglify');

gulp.task('minify', function() {
  return gulp.src('satellizer.js')
    .pipe(plumber())
    .pipe(uglify())
    .pipe(rename('satellizer.min.js'))
    .pipe(gulp.dest('.'))
});

gulp.task('concat', function() {
  return gulp.src([
    'src/satellizer.js',
    'src/config.js',
    'src/auth.js',
    'src/local.js',
    'src/oauth1.js',
    'src/oauth2.js',
    'src/popup.js',
    'src/utils.js',
    'src/interceptor.js',
    'src/run.js'
  ])
    .pipe(concat('satellizer.js'))
    .pipe(gulp.dest('dist'));
});

gulp.task('copy', function() {
  return gulp.src(['satellizer.js', 'satellizer.min.js'])
    .pipe(gulp.dest('examples/client/vendor'));
});

gulp.task('complexity', function() {
  return gulp.src('satellizer.js')
    .pipe(complexity());
});

gulp.task('watch', function() {
  gulp.watch('satellizer.js', ['copy', 'minify']);
});

gulp.task('php', function() {
  return gulp.src('examples/client/**/*.*')
    .pipe(gulp.dest('examples/server/php/public'))
});

gulp.task('java', function() {
  return gulp.src('examples/client/**/*.*')
    .pipe(gulp.dest('examples/server/java/src/main/resources/assets'))
});

gulp.task('default', ['copy', 'concat', 'minify', 'watch']);