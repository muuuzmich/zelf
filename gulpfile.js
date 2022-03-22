"use strict";

// Load plugins
const fs = require("fs");
const path = require("path");
const autoprefixer = require("autoprefixer");
const browsersync = require("browser-sync").create();
const cp = require("child_process");
const cssnano = require("cssnano");
const del = require("del");
const eslint = require("gulp-eslint");
const gulp = require("gulp");
const imagemin = require("gulp-imagemin");
const newer = require("gulp-newer");
const plumber = require("gulp-plumber");
const minify = require('gulp-minify');
const postcss = require("gulp-postcss");
const rename = require("gulp-rename");
const sass = require("gulp-sass");
const pug = require("gulp-pug");
const concat = require('gulp-concat');
const htmlmin = require('gulp-htmlmin');


// BrowserSync
function browserSync(done) {
    browsersync.init({
        startPath: "en",
        server: {
            baseDir: "./dist/",
        },
        port: 3000
    });
    done();
}

// BrowserSync Reload
function browserSyncReload(done) {
    browsersync.reload();
    done();
}

// Clean assets
function clean() {
    return del(["./src/assets/"]);
}

// Optimize Images
function images() {
    return gulp
        .src("./src/img/**/*")
        .pipe(newer("./src/img/**/*"))
        .pipe(
            imagemin([
                imagemin.gifsicle({interlaced: true}),
                // imagemin.jpegtran({ progressive: true }),
                imagemin.optipng({optimizationLevel: 5}),
                imagemin.svgo({
                    plugins: [
                        {
                            removeViewBox: false,
                            collapseGroups: true
                        }
                    ]
                })
            ])
        )
        .pipe(gulp.dest("./dist/assets/img"));
}

// CSS task
function css() {
    return gulp
        .src("./src/style/**/*.scss")
        .pipe(plumber())
        .pipe(sass({outputStyle: "expanded"}))
        .pipe(gulp.dest("./dist/assets/css/"))
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(rename({suffix: ".min"}))
        .pipe(gulp.dest("./dist/assets/css/"))
        .pipe(browsersync.stream());
}

//pug tast
function buildPug() {
    return gulp
        .src(["./src/**/*.pug", '!./src/components/**/*.pug'])
        .pipe(pug({
            pretty: true,
            locals: {
                rq : require,
                es: 'es',
                fr: 'fr',
            }
        }))
        .pipe(htmlmin(
            {
                removeComments: true,
                // collapseWhitespace: true
            }
        ))
        .pipe(gulp.dest('./dist/'));
}


// Transpile, concatenate and minify scripts
function scripts() {
    return (
        gulp
            .src(["./src/js/lib/skrollr.js", "./src/js/lib/aos.js", "./src/js/lib/lazysizes.js", "./src/js/main.js"])
            .pipe(concat('all.js'))
            .pipe(plumber())
            .pipe(minify())
            .pipe(gulp.dest("./dist/assets/js/"))
            .pipe(browsersync.stream())
    );
}

function move_scripts() {
    return (
        gulp
            .src(["./src/js/*.js"])
            .pipe(plumber())
            .pipe(minify())
            .pipe(gulp.dest("./dist/assets/js/"))
            .pipe(browsersync.stream())
    );
}

function getFolders(dir) {
    let fontFolders = fs.readdirSync(dir).filter(file => fs.statSync(path.join(dir, file)).isDirectory());
    return fontFolders.map(fontFolder => {
        let fontFormats = fs.readdirSync(path.join(dir, fontFolder)).filter(file => fs.statSync(path.join(dir, fontFolder, file)).isDirectory());
        let fonts = [];
        fontFormats.map(fontFormat => {
            fonts = fonts.concat(fs.readdirSync(path.join(dir, fontFolder, fontFormat)).map(font =>
                path.join('./', dir, fontFolder, fontFormat, font)
            ))
            ;
        });
        return {[fontFolder]: fonts}
    });
}

const folders = getFolders('./src/style/fonts/');

function fonts() {

    folders.map(function (folder) {
        let fonts = Object.keys(folder);
        return fonts.map(font => gulp.src(folder[font]).pipe(gulp.dest('./dist/assets/fonts/' + font + '/')))
    });

}

// Watch files
function watchFiles() {
    gulp.watch("./src/style/**/*.scss", gulp.series(css, browserSyncReload));
    gulp.watch("./src/js/**/*", gulp.series(scripts, move_scripts));
    gulp.watch("./src/**/*.pug", gulp.series(buildPug, browserSyncReload));
    gulp.watch("./src/img/**/*", images);
}

// define complex tasks
const js = gulp.series(scripts, move_scripts);
const build = gulp.series(clean, gulp.parallel(css, images, buildPug, js));
const watch = gulp.series(gulp.parallel(watchFiles, browserSync));

// export tasks
exports.images = images;
exports.css = css;
exports.js = js;
exports.clean = clean;
exports.build = build;
exports.watch = watch;
exports.default = build;
exports.fonts = fonts;