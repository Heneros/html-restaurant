const gulp = require('gulp');
const plumber = require('gulp-plumber')
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const imagemin = require("gulp-imagemin");
const imageminJpegRecompress = require('imagemin-jpeg-recompress');
const imageminJpegtran = require('imagemin-jpegtran');
const pngquant = require('imagemin-pngquant');
const cssmin = require('gulp-cssmin');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
// const uglify = require('gulp-uglify');
const babel = require('gulp-babel');
const webpack = require("webpack-stream");

sass.compiler = require('node-sass');

gulp.task('serve', function(){
  browserSync.init({
      server: {
          baseDir: "./build"
      }
  })
});



gulp.task('html', function(){
    return gulp.src('src/*.html')
    .pipe(gulp.dest('build/'))
    .pipe(browserSync.reload({stream: true}));
});

const cssFiles = [
  "src/sass/*.css",
  "node_modules/slick-slider/slick/slick.css",
  "src/sass/*.scss"
];

const scripts = [ 
  "node_modules/jquery/dist/jquery.min.js",
  "node_modules/slick-slider/slick/slick.min.js",
  "src/js/*.js"
];


gulp.task('images', function(){
return gulp.src('src/img/**/*.{png,jpg}')
.pipe(imagemin([
    imageminJpegtran({progressive: true}),
    imageminJpegRecompress({
        loops: 5,
        min: 65,
        max: 70,
        quality: [0.7, 0.8]
    }),
    imagemin.optipng({optimizationLevel: 3}),
    pngquant({quality: [0.7, 0.8], speed: 5})
]))
.pipe(gulp.dest('build/img'))
});

gulp.task('allimg', function(){
    return gulp.src('src/img/**/*.{png,jpg,svg}')
    .pipe(gulp.dest('build/img'))
    .pipe(browserSync.reload({stream: true}));
  });


gulp.task('sass', function () {
return gulp.src(cssFiles)
    .pipe(plumber())
    .pipe(sass())
    .pipe(cssmin())
    .pipe(autoprefixer([
        'last 15 versions',
        '> 1%',
        'ie 8', 
        'ie 7'
        ], 
        { 
        cascade: true
        }))
    .pipe(concat(('style.css')))
    .pipe(gulp.dest('build/css'))
    .pipe(browserSync.reload({stream: true}));
});

gulp.task('js', function(){
return gulp.src(scripts) 
.pipe(babel({
  presets: ["@babel/preset-env"]
}))
// .pipe(uglify()) 
// .pipe(concat(('script.js')))
.pipe(gulp.dest('build/js'))
.pipe(browserSync.reload({stream: true}));
});


gulp.task("build-js", () => {
  return gulp.src("src/js/dev/*.js")
              .pipe(webpack({
                  mode: 'development',
                  output: {
                      filename: 'main.js'
                  },
                  watch: false,
                  devtool: "source-map",
                  module: {
                      rules: [
                        {
                          test: /\.m?js$/,
                          exclude: /(node_modules|bower_components)/,
                          use: {
                            loader: 'babel-loader',
                            options: {
                              presets: [['@babel/preset-env', {
                                  debug: true,
                                  corejs: 3,
                                  useBuiltIns: "usage"
                              }]]
                            }
                          }
                        }
                      ]
                    }
              }))
              .pipe(gulp.dest('build/js'))
              .pipe(browserSync.reload({stream: true}));
});

gulp.task("build-prod-js", () => {
  return gulp.src("src/js/dev/*.js")
              .pipe(webpack({
                  mode: 'production',
                  output: {
                      filename: 'main.js'
                  },
                  module: {
                      rules: [
                        {
                          test: /\.m?js$/,
                          exclude: /(node_modules|bower_components)/,
                          use: {
                            loader: 'babel-loader',
                            options: {
                              presets: [['@babel/preset-env', {
                                  corejs: 3,
                                  useBuiltIns: "usage"
                              }]]
                            }
                          }
                        }
                      ]
                    }
              }))
  .pipe(gulp.dest('build/js'))
  .pipe(browserSync.reload({stream: true}));

});



gulp.task('watch', function(){
    gulp.watch('src/*.html', gulp.series('html')),
    gulp.watch(cssFiles, gulp.series("sass"), browserSync.reload),
    gulp.watch(scripts, gulp.series('js')),  
    gulp.watch("src/js/dev/*.js", gulp.series('build-js')),  
    gulp.watch("src/js/dev/*.js", gulp.series('build-prod-js')),  
    gulp.watch("src/img/**/*.{png,jpg}", gulp.series("images"))
    gulp.watch("src/img/**/*.{png,jpg,svg}", gulp.series("allimg"))
  });
  
  gulp.task('default', gulp.series(
    gulp.parallel('html','build-js', 'build-prod-js', 'sass', 'js','images', 'allimg'),
    gulp.parallel('watch', 'serve' )
  ));