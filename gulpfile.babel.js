import gulp from 'gulp';
import concat from 'gulp-concat'; //bundles files
import sass from 'gulp-sass'; //sass compiling/translating
import babel from 'gulp-babel'; //es6 translating
import plumber from 'gulp-plumber'; //gives errors for compiling

const paths = {
    scssSource: './public/styles/**/*.scss',
    scssDest: './public/compiled/styles',
    jsSource: './public/js/**/*.js',
    jsDest: './public/compiled/js'
};


//sourcemaps
//cachebust
gulp.task('styles', () => {
    return gulp.src(paths.scssSource)
        .pipe(sass().on('error', sass.logError))
        .pipe(concat('styles.css'))
        .pipe(gulp.dest(paths.scssDest));
});

gulp.task('frontjs', () => {
    return gulp.src(paths.jsSource)
        .pipe(plumber())
        .pipe(babel({
            presets: ["es2015"]
        }))
        .pipe(concat('bundle.js'))
        .pipe(gulp.dest(paths.jsDest));
});

gulp.task('watch', () => {
    gulp.watch(paths.jsSource, ['frontjs']);
    gulp.watch(paths.scssSource, ['styles']);
});

gulp.task('default', ['frontjs', 'styles', 'watch']);
