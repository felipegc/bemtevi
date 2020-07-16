var gulp = require('gulp');
var uglify = require('gulp-uglify');
var cleancss = require('gulp-clean-css');
const babel = require('gulp-babel');
var browserSync = require('browser-sync').create();

function images() {
  return gulp.src('src/images/*')
    .pipe(gulp.dest('dist/images'))
};

function fonts() {
  return gulp.src('src/fonts/*')//'node_modules/font-awesome/fonts/*'
    .pipe(gulp.dest('dist/fonts'))
};

function html() {
  return gulp.src('src/*.html')
    .pipe(gulp.dest('dist'))
};

function js() {
  return gulp.src([
      'node_modules/bootstrap/dist/js/bootstrap.min.js',
      'node_modules/popper.js/dist/umd/popper.min.js',
      'node_modules/aos/dist/aos.js',
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/jquery-mask-plugin/dist/jquery.mask.js',
      'src/js/*.js'])
    .pipe(babel({
      presets: ['@babel/preset-env']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('dist/js'))
};

function css() {
  return gulp.src([
      'node_modules/bootstrap/dist/css/bootstrap.min.css',
      'node_modules/aos/dist/aos.css',
      'node_modules/font-awesome/css/font-awesome.min.css',
      'src/css/*.css'])
    .pipe(cleancss('bemtevi-style.css'))
    .pipe(gulp.dest('dist/css'))
};

function cssDev() {
  return gulp.src([
      'node_modules/bootstrap/dist/css/bootstrap.min.css',
      'node_modules/aos/dist/aos.css',
      'node_modules/font-awesome/css/font-awesome.min.css',])
    .pipe(gulp.dest('src/css'))
    .pipe(browserSync.stream());
}

function jsDev() {
  return gulp.src([
      'node_modules/bootstrap/dist/js/bootstrap.min.js',
      'node_modules/popper.js/dist/umd/popper.min.js',
      'node_modules/aos/dist/aos.js',
      'node_modules/jquery/dist/jquery.min.js',
      'node_modules/jquery-mask-plugin/dist/jquery.mask.js'])
    .pipe(gulp.dest('src/js'))
    .pipe(browserSync.stream());
}

function watch() {
  browserSync.init({
      server: {
         baseDir: "src",
         index: "/index.html"
      }
  });
  gulp.watch('src/css/*.css').on('change', browserSync.reload);
  gulp.watch('src/*.html').on('change', browserSync.reload);
  gulp.watch('src/js/*.js').on('change', browserSync.reload);
}

exports.fonts = fonts;
exports.html = html;
exports.images = images;
exports.css = css;
exports.cssDev = cssDev;
exports.js = js;
exports.jsDev = jsDev;
exports.watch = watch;

gulp.task('dev', gulp.series(jsDev, cssDev, watch));
gulp.task('build', gulp.parallel(js, css, html, images, fonts));
