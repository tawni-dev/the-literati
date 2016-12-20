import gulp from 'gulp';
import concat from 'gulp-concat'; //bundles files
import sass from 'gulp-sass'; //sass compiling/translating
import babel from 'gulp-babel'; //es6 translating
import plumber from 'gulp-plumber'; //gives errors for compiling

const paths = {
    scssSource: './styles/**/*.scss',
    scssDest: './compiled/styles',
    vendorJsSources: [],
    vendorCSSSources: [],
    jsSource: './js/**/*.js',
    jsDest: './compiled/js'
};

// Add our vendor dependencies
paths.vendorJsSources.push('./node_modules/angular/angular.js');
paths.vendorJsSources.push('./node_modules/angular-ui-router/release/angular-ui-router.js');

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

gulp.task('vendorCSS', () => {
    return gulp.src(paths.vendorCSSSources)
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest(paths.scssDest));
});

gulp.task('vendorJs', () => {
    return gulp.src(paths.vendorJsSources)
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest(paths.jsDest));
});

gulp.task('watch', () => {
    gulp.watch(paths.jsSource, ['frontjs']);
    gulp.watch(paths.scssSource, ['styles']);
});

gulp.task('default', ['vendorJs', 'vendorCSS', 'watch', 'frontjs', 'styles']);
