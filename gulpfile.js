const gulp = require('gulp');

const del = require('del');
const handlebars = require('gulp-compile-handlebars');
const rename = require('gulp-rename');
var sass = require('gulp-sass');
const stylus = require('gulp-stylus');

const config = {
  src: "./src",
  pages: "./src/pages/*.hbs",
  partials: "./src/partials",
  styl: "./src/styl/*.styl",
  sass: "./src/sass/*.sass",
  assets: "./src/assets/**/*",
  cname: "./src/CNAME",
  dest: "./docs",
  html: "./docs/*.html",
  css: "./docs/css",
  destassets: "./docs/assets/**/*"
}

// CLEANERS
gulp.task('cleanall', () => del(config.dest));
gulp.task('cleanhtml', () => del(config.html));
gulp.task('cleancss', () => del(config.css));
gulp.task('cleanassets', () => del(config.destassets));

// BUILDERS
gulp.task('stylus', () => {
  return gulp.src(config.styl)
    .pipe(stylus())
    .pipe(gulp.dest(config.css));
});

gulp.task('sass', () => {
  return gulp.src(config.sass)
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest(config.css));
});

gulp.task('html', () => {
  return gulp.src(config.pages)
    .pipe(handlebars({}, {
      ignorePartials: true,
      batch: [config.partials]
    }))
    .pipe(rename({
      extname: '.html'
    }))
    .pipe(gulp.dest(config.dest));
});

gulp.task('assets', () => {
  return gulp.src(config.assets, { base:'./src' })
  .pipe(gulp.dest(config.dest));
});

gulp.task('cname', () => {
  return gulp.src(config.cname)
  .pipe(gulp.dest(config.dest));
});

// WATCHERS
gulp.task('watchers', () => {
  gulp.watch(config.pages, gulp.series('cleanhtml', 'html'));
  gulp.watch(config.partials, gulp.series('cleanhtml', 'html'));
  gulp.watch(config.styl, gulp.series('stylus'));
  gulp.watch(config.sass, gulp.series('sass'));
  gulp.watch(config.assets, gulp.series('cleanassets', 'assets'));
});

// RUNNERS
const buildList = [
  'cleanall',
  'cname',
  'html',
  'stylus',
  'sass',
  'assets'
];

gulp.task('build', gulp.series(...buildList));
gulp.task('watch', gulp.series(...buildList, 'watchers'));
