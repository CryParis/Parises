import gulp from 'gulp'
import less from 'gulp-less'
import stylus from 'gulp-stylus'
import rename from 'gulp-rename'
import cleanCSS from 'gulp-clean-css'
import ts from 'gulp-typescript'
import babel from 'gulp-babel'
import uglify from 'gulp-uglify'
import concat from 'gulp-concat'
import sourcemaps from 'gulp-sourcemaps'
import autoPrefixer from 'gulp-autoprefixer'
import imagemin from 'gulp-imagemin'
import htmlmin from 'gulp-htmlmin'
import size from 'gulp-size'
import newer from 'gulp-newer'
import gulppug from 'gulp-pug'
import browsersync from 'browser-sync'
import {deleteAsync} from 'del'

let brow=browsersync.stream()
const paths = {
    pug: {
        src: 'src/*.pug',
        dest: 'dist'
    },
    html: {
        src: 'src/*.html',
        dest: 'dist'
    },
    styles: {
        src: ['src/styles/**/*.styl','src/styles/**/*.less'],
        dest: 'dist/css/'
    },
    scripts: {
        src: ['src/scripts/**/*.ts','src/scripts/**/*.js'],
        dest: 'dist/js/'
    },
    images: {
        src:'src/img/**',
		dest: 'dist/img'
    }
}

export function clean() {
    return deleteAsync(['dist/*','!dist/img'])
}

export function pug() {
    return gulp.src(paths.pug.src)
    .pipe(gulppug())
    .pipe(size({
        showFiles:true
    }))
    .pipe(gulp.dest(paths.pug.dest))
    .pipe(brow)
}

export function html() {
    return gulp.src(paths.html.src)
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(size({
        showFiles:true
    }))
    .pipe(gulp.dest(paths.html.dest))
    .pipe(brow)
}

export function styles() {
    return gulp.src(paths.styles.src)
        .pipe(sourcemaps.init())
        //.pipe(less())
        //.pipe(stylus())
        .pipe(cleanCSS({
            level:2
        }))
        .pipe(rename({
            basename:'main',
            suffix: '.min'
        }))
        .pipe(sourcemaps.write('.'))
        .pipe(size({
            showFiles:true
        }))
        .pipe(gulp.dest(paths.styles.dest))
}

export function scripts() {
    return gulp.src(paths.scripts.src)
    .pipe(sourcemaps.init())
    .pipe(ts({
        noImplicitAny: true,
        outFile: 'main.min.js'
    }))
      .pipe(babel({
          presets:['@babel/env']
      }))
      .pipe(uglify())
      .pipe(concat('main.min.js'))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(paths.scripts.dest))
}

export function img() {
    return gulp.src(paths.images.src)
        .pipe(newer(paths.images.dest))
		.pipe(imagemin())
        .pipe(size({
            showFiles:true
        }))
		.pipe(gulp.dest(paths.images.dest))
      
}

export function watch() {
    browsersync.init({
        server: {
            baseDir: "./dist"
        }
    })
    gulp.watch(paths.html.src).on('change', browsersync.reload)
    gulp.watch(paths.html.src, html)
    gulp.watch(paths.styles.src, styles)
    gulp.watch(paths.scripts.src, scripts)
    gulp.watch(paths.images.src, img)
}

const build=gulp.series(clean,html,gulp.parallel(styles,scripts,img))