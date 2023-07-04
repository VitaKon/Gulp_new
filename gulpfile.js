const { src, dest, series, watch } = require('gulp')
const concat = require('gulp-concat')
const htmlmin = require('gulp-htmlmin')
const autoprefixes = require('gulp-autoprefixer')
const cleanCSS = require('gulp-clean-css')
const image = require('gulp-image')
const svgSrpite = require('gulp-svg-sprite')
const babel = require('gulp-babel')
const uglify = require('gulp-uglify-es').default
const notify = require('gulp-notify')
const sourcmaps = require('gulp-sourcemaps')
const del = require('del')
const browserSync = require('browser-sync').create()

const clean = () => {
  return del(['dist'])
}

const resources = () => {
  return src('src/resources/**')
    .pipe(dest('dist'))
}

const styles = () => {
  return src('src/styles/**/*.css')
    .pipe(sourcmaps.init())
    .pipe(concat('main.css'))
    .pipe(autoprefixes({
      cascade: false,
    }))
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(sourcmaps.write())
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}

const stylesDev = () => {
  return src('src/styles/**/*.css')
    .pipe(sourcmaps.init())
    .pipe(concat('main.css'))
    .pipe(cleanCSS({
      level: 2
    }))
    .pipe(dest('dist'))
}

const htmlminify = () => {
  return src('src/**/*.html')
    .pipe(htmlmin({
      collapseWhitespace: true,
    }))
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}

const htmlminifyDev = () => {
  return src('src/**/*.html')
    .pipe(dest('dist'))
}

const svgSrpites = () => {
  return src('src/imeges/svg/**/*.svg')
    .pipe(svgSrpite({
      mode: {
        stack: {
          sprite: '../sprite.svg'
        }
      }
    }))
    .pipe(dest('dist/imeges'))
}

const scripts = () => {
  return src([
    'src/js/components/**/*.js',
    'src/js/main.js'
  ])
    .pipe(sourcmaps.init())
    .pipe(babel({
      presets: ['@babel/env']
    }))
    .pipe(concat('app.js'))
    .pipe(uglify({
      toplevel: true //для скрытия кода, замена на другие символы
    }).on('error', notify.onError()))
    .pipe(sourcmaps.write())
    .pipe(dest('dist'))
    .pipe(browserSync.stream())
}

const scriptsDev = () => {
  return src([
    'src/js/components/**/*.js',
    'src/js/main.js'
  ])
    .pipe(sourcmaps.init())
    .pipe(concat('app.js'))
    .pipe(uglify().on('error', notify.onError()))
    .pipe(dest('dist'))
}

const watchFiles = () => {
  browserSync.init({
    server: {
      baseDir: 'dist'
    }
  })
}

const images = () => {
  return src([
    'src/imeges/**/*.jpg',
    'src/imeges/**/*.png',
    'src/imeges/*.svg',
    'src/imeges/**/*.jpeg',
  ])
    .pipe(image())
    .pipe(dest('dist/imeges'))
}

watch('src/**/*.html', htmlminify)
watch('src/styles/**/*.css', styles)
watch('src/images/svg/**/*.svg', svgSrpites)
watch('src/js/**/*js', scripts)
watch('src/resources/**', resources)

exports.styles = styles
exports.htmlminify = htmlminify
exports.scripts = scripts
exports.default = series(clean, resources, htmlminify, scripts, styles, svgSrpites, images, watchFiles)
exports.dev = series(resources, htmlminifyDev, scriptsDev, stylesDev, svgSrpites, images, watchFiles)
