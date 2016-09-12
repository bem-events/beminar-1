var gulp = require('gulp'),
    concat = require('gulp-concat'),
    rename = require('gulp-rename'),
    browserSync = require('browser-sync').create(),
    reload = browserSync.reload,
    path = require('path'),
    url = require('gulp-css-url-adjuster'),
    autoprefixer = require('autoprefixer-core'),
    postcss = require('gulp-postcss');

var params = {
    out: 'public/',
    htmlSrc: 'index.potter.html',
    levels: ['common.blocks', 'potter.blocks']
},
    getFileNames = require('html2bl').getFileNames(params);

gulp.task('default', ['server', 'build']);

gulp.task('build', ['html', 'css', 'images']);

gulp.task('server', function() {
    browserSync.init({
        server: params.out
    });

    gulp.watch('*.html', ['html']);

    gulp.watch(params.levels.map(function(level) {
        var cssGlob = level + '/**/*.css';
        return cssGlob;
    }), ['css']);
});

gulp.task('html', function() {
    gulp.src(params.htmlSrc)
    .pipe(rename('index.html'))
    .pipe(gulp.dest(params.out))
    .pipe(reload({ stream: true }));
});

gulp.task('css', function() {
    getFileNames.then(function(files) {
        return gulp.src(files.css)
            .pipe(concat('styles.css'))
            .pipe(url({
                prepend: 'images/'
            }))
            .pipe(postcss([ autoprefixer() ]))
            .pipe(gulp.dest(params.out))
            .pipe(reload({ stream: true }));
    })
    .done();
});

gulp.task('images', function() {
    getFileNames.then(function(src) {
        gulp.src(src.dirs.map(function(dirName) {
            var imgGlob = path.resolve(dirName) + '/*.{jpg,png,svg}';
            console.log(imgGlob);
            return imgGlob;
        }))
        .pipe(gulp.dest(path.join(params.out + '/images/')));
    })
    .done();
});
