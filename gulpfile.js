var _ = require('lodash'),
    browserify = require('browserify'),
    browserSync = require('browser-sync'),
    buffer = require('vinyl-buffer'),
    cached = require('gulp-cached'),
    concat = require('gulp-concat'),
    dateFormat = require('dateformat'),
    footer = require('gulp-footer'),
    gulp = require('gulp'),
    gutil = require('gulp-util'),
    header = require('gulp-header'),
    jshint = require('gulp-jshint'),
    gulpNgAnnotate = require('gulp-ng-annotate'),
    browserifyNgAnnotate = require('browserify-ngannotate'),
    pkg = require('./package.json'),
    path = require('path'),
    preprocessify = require('preprocessify'),
    prettyBytes = require('pretty-bytes'),
    remember = require('gulp-remember'),
    rename = require('gulp-rename'),
    source = require('vinyl-source-stream'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    watchify = require('watchify'),
    bundleName = 'angular-iscroll.js',
    examplesDestRoot = 'dist/examples/',
    paths = {
        lib: {
            src: path.join('src/lib', bundleName),
            dest: 'dist/lib/'
        },
        examples: {
            root: examplesDestRoot,
            index: {
                src: './src/examples/index.html',
                dest: examplesDestRoot
            },
            js: {
                bundleName: 'bundle.js',
                src: './src/examples/app.js',
                dest: path.join(examplesDestRoot, 'js')
            }
        }
    },
    browserifyStats = {
        bytes: null,
        time: null
    },
    bundler = watchify(browserify(_.extend({
        entries: paths.examples.js.src,
        debug: true
    }, watchify.args)));

gulp.task('lib', function () {
    var now = new Date();

    return gulp.src(paths.lib.src)
        .pipe(cached('lib'))            // Only pass through changed files.
        .pipe(jshint())
        .pipe(header('/**\n' +
        ' * @license <%= pkg.name %> v<%= pkg.version %>, <%= now %>\n' +
        ' * (c) <%= years %> <%= pkg.author.name %> <<%= pkg.author.email %>>\n' +
        ' * License: <%= pkg.license %>\n' +
        ' */\n' +
        ';(function (window) {\n', {
            now: dateFormat(now, "isoDateTime"),
            years: dateFormat(now, "yyyy"),
            pkg: pkg
        }))
        .pipe(footer('})(window);\n'))
        .pipe(remember('lib'))          // Add back all files to the stream.
        .pipe(concat('angular-iscroll.js')) // Do things that require all files.
        .pipe(gulpNgAnnotate())
        .pipe(gulp.dest(paths.lib.dest))
        .pipe(uglify({
            preserveComments: 'some'
        }))
        .pipe(rename({
            extname: '.min.js'
        }))
        .pipe(gulp.dest(paths.lib.dest));

});

gulp.task('default', ['lib']);


gulp.task('browser-sync', function() {
    browserSync({
        open: false,  // You have to manually open 'http://localhost:3000/'.
        server: {
            baseDir: paths.examples.root
        }
    });
});


gulp.task('views', function() {
    return gulp.src(paths.examples.index.src)
        //.pipe(htmlmin({
        //    collapseWhitespace: true,
        //    removeComments: true
        //}))
        //.pipe(htmlify())
        .pipe(gulp.dest(paths.examples.index.dest));


});

function bundle() {
    gutil.log('Starting',
            gutil.colors.cyan("'browserify-rebundle'"), '...');
    return bundler.bundle()
        // log errors if they happen
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('bundle.js'))
        // Optional, remove if you don't want sourcemaps.
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
        .pipe(sourcemaps.write('./')) // writes .map file
        //
        .pipe(gulp.dest(paths.examples.js.dest));
}

// Add any other browserify options or transforms here.
bundler
    .transform(preprocessify({
        pkg: pkg
    }))
    .transform(browserifyNgAnnotate)
    .on('update', bundle)
    .on('bytes', function (bytes) {
        browserifyStats.bytes = bytes;
    })
    .on('time', function (time) {
        browserifyStats.time = time;
    })
    .on('log', function () {
        gutil.log('Finished',
            gutil.colors.cyan("'browserify-rebundle'"), 'after',
            gutil.colors.magenta((browserifyStats.time / 1000).toFixed(2) + ' s'));
        gutil.log('Browserify bundled',
            gutil.colors.cyan(prettyBytes(browserifyStats.bytes)), 'into',
            gutil.colors.magenta(paths.examples.js.bundleName));
        browserSync.reload();
    });


gulp.task('watch-examples', function () {
    return gulp.watch(paths.examples.index.src, ['views', browserSync.reload]);
});

gulp.task('examples', ['browser-sync', 'views', 'watch-examples'], bundle);

gulp.task('watch', function () {
    var watcher = gulp.watch(paths.lib.src, ['lib']);

    watcher.on('change', function _srcChanged(event) {
        if (event.type === 'deleted') {
            delete cached.caches.lib[event.path];
            remember.forget('lib', event.path);
        }
    });
});

