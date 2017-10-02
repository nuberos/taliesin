var gulp = require('gulp');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');
//var eslint = require('gulp-eslint');
var less = require('gulp-less');
var uglify = require('gulp-uglify');
var path = require('path');
var nodemon = require('nodemon');
var babel = require("gulp-babel");
var webpack= require('webpack-stream');


const SRC_DIR = path.join(__dirname, 'src');
const CLIENT_DIR = path.join(SRC_DIR, 'public');
const SERVER_DIR = path.join(SRC_DIR,'server');
const SRC_FILES = path.join(SRC_DIR, '**', '*.js');
const NODE_FILES = path.join(SERVER_DIR ,'**', '*.js');
const REACT_FILES = path.join(CLIENT_DIR,'js','**', '*.js');
const LESS_DIR = path.join(CLIENT_DIR, 'less');
const LESS_FILES = path.join(LESS_DIR,'*.less');
const CSS_DIR = path.join(CLIENT_DIR, 'css');
const GEOJSON_DIR = path.join(CLIENT_DIR, 'geojson');

const webpackCfg = require('./webpack.config.js');

var tasks = {
  development: ['less', 'geojson', 'start'],
  staging: ['less', 'geojson','webpack'],
  production: ['less', 'geojson','webpack']
}

/*
gulp.task('lint', function() {
  return gulp.src([SRC_FILES])
  .pipe(eslint())
  .pipe(eslint.format())
  .pipe(eslint.failAfterError());
});
*/
gulp.task('default', tasks[process.env.NODE_ENV] || ['less','dist'],function() {
  console.log('executed default task');
});

gulp.task('less', function() {
  return gulp.src(LESS_FILES)
  .pipe(less({
    paths: [path.join(LESS_DIR, 'includes')]
  }))
  .pipe(gulp.dest(CSS_DIR));
});

gulp.task('geojson',function(cb) {
  gulp.src(path.join(GEOJSON_DIR,'*.json'))
  .pipe(gulp.dest('dist'));
});

gulp.task('dist',function(cb) {
  gulp.src(REACT_FILES)
  .pipe(sourcemaps.init())
  .pipe(babel())
  .pipe(sourcemaps.write("."))
  .pipe(gulp.dest('dist'))
  .on('end',function() {
    gutil.log('dist finished', 'Really it did', gutil.colors.magenta('123'));
    cb(null);
  });
});

gulp.task('webpack',['dist'],function() {
  gutil.log('webpack started', gutil.colors.green('123'));
  return gulp.src(path.join(SRC_DIR, 'dist','index.js'))
  .pipe(webpack(webpackCfg))
  .pipe(gutil.env.type === 'production' ? uglify() : gutil.noop())
  .pipe(gulp.dest('dist'))
  .on('end',function () {
      gutil.log('webpack finished', 'Really it did', gutil.colors.magenta('123'));
  });
});

gulp.task('start',['webpack'],function() {
  nodemon({
    script: path.join(SERVER_DIR,'index.js'),
    ext: 'js css html',
    env: {'NODE_ENV': 'development'},
    tasks: ['']
  }).on('restart', function() {
      console.log('server restarted!');
  });
});
