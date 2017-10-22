const gulp = require('gulp');

const browserSync = require('browser-sync');
const del = require('del');
const handlebars = require('gulp-compile-handlebars');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

// SERVERS
const server = browserSync.create();

function reload(done) {
  server.reload();
  done();
}

function serve(done) {
  server.init({
    server: {
      baseDir: './docs/'
    }
  });
  done();
}

// FINDERS
const config = {
  src: "./src",
  pages: "./src/pages/*.hbs",
  partials: "./src/partials",
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
gulp.task('sass', () => {
  return gulp.src(config.sass)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(sourcemaps.write('.'))
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
  gulp.watch(config.pages, gulp.series('cleanhtml', 'html', reload));
  gulp.watch(config.partials, gulp.series('cleanhtml', 'html', reload));
  gulp.watch(config.sass, gulp.series('cleancss', 'sass', reload));
  gulp.watch(config.assets, gulp.series('cleanassets', 'assets', reload));
});

// RUNNERS
const buildList = [
  'cleanall',
  'cname',
  'html',
  'sass',
  'assets'
];

gulp.task('build', gulp.series(...buildList));
gulp.task('dev', gulp.series(...buildList, serve, 'watchers'));
