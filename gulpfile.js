var _ = require('lodash'),
    browserify = require('browserify'),
    browserSync = require('browser-sync'),
    buffer = require('vinyl-buffer'),
    cached = require('gulp-cached'),
    concat = require('gulp-concat'),
    connect = require('gulp-connect'),
    dateFormat = require('dateformat'),
    footer = require('gulp-footer'),
    ghPages = require('gulp-gh-pages'),
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
    //process = require('process'),
    remember = require('gulp-remember'),
    rename = require('gulp-rename'),
    sass = require('gulp-ruby-sass'),
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
            src: './src/examples/',
            root: examplesDestRoot,
            index: {
                src: './src/examples/index.html',
                dest: examplesDestRoot
            },
            js: {
                bundleName: 'bundle.js',
                src: './src/examples/app.js',
                dest: path.join(examplesDestRoot, 'js')
            },
            style: {
                src: './src/examples/scss/style.scss',
                dest: path.join(examplesDestRoot, 'css'),
                bootstrap: {
                    assets: './node_modules/bootstrap-sass/assets/',
                    sass: './node_modules/bootstrap-sass/assets/stylesheets/'
                }
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

//process.env.BROWSERIFYSHIM_DIAGNOSTICS = 1;

function _getNow() {
    return new Date();
}

gulp.task('lib', function () {
    var now = _getNow();

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

gulp.task('watch', function () {
    var watcher = gulp.watch(paths.lib.src, ['lib']);

    watcher.on('change', function _srcChanged(event) {
        if (event.type === 'deleted') {
            delete cached.caches.lib[event.path];
            remember.forget('lib', event.path);
        }
    });
});

gulp.task('default', ['lib']);


gulp.task('browser-sync', function () {
    browserSync({
        open: false,  // You have to manually open 'http://localhost:3000/'.
        server: {
            baseDir: paths.examples.root
        }
    });
});

gulp.task('connect', function () {
    connect.server({
        root: paths.examples.root,
        port: 3001,
        livereload: true
    });
});

gulp.task('bootstrap-assets', function () {
    gulp.src(path.join(
        paths.examples.style.bootstrap.assets, '@(fonts|images)/**/*'))
        .pipe(gulp.dest(paths.examples.root));
});

gulp.task('style', ['bootstrap-assets' /*, 'wrap-vendor-css'*/], function () {
    return sass(paths.examples.style.src, {
        loadPath: [paths.examples.style.bootstrap.sass],
        compass: true,
        sourcemap: true,
        style: 'compact'
    })
        .on('error', gutil.log.bind(gutil, 'Sass/Compass Error'))
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(paths.examples.style.dest))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('demo-views', function () {
    return gulp.src(path.join(paths.examples.src, '**/*.html'))
        .pipe(gulp.dest(paths.examples.index.dest))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('views', ['demo-views'], function () {
    return gulp.src(paths.examples.index.src)
        //.pipe(htmlmin({
        //    collapseWhitespace: true,
        //    removeComments: true
        //}))
        //.pipe(htmlify())
        .pipe(gulp.dest(paths.examples.index.dest))
        .pipe(browserSync.reload({stream: true}));
});


function bundle() {
    gutil.log("Starting '" + gutil.colors.cyan("browserify-rebundle") +  "' ...");
    return bundler.bundle()
        // log errors if they happen
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('bundle.js'))
        // Optional, remove if you don't want sourcemaps.
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
        .pipe(sourcemaps.write('./')) // writes .map file
        //
        .pipe(gulp.dest(paths.examples.js.dest))
        .pipe(browserSync.reload({stream: true}));
}

// Add any other browserify options or transforms here.
bundler
    .transform(preprocessify({
        now: dateFormat(_getNow(), "isoDateTime"),
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
        gutil.log("Finished '" + gutil.colors.cyan("browserify-rebundle") + "' after",
            gutil.colors.magenta((browserifyStats.time / 1000).toFixed(2) + " s"));
        gutil.log('Browserify bundled',
            gutil.colors.cyan(prettyBytes(browserifyStats.bytes)), 'into',
            gutil.colors.magenta(paths.examples.js.bundleName));
    });

gulp.task('rebundle', function () {
    return bundle();
});

gulp.task('watch-examples', function () {
    gulp.watch(path.join(paths.lib.dest, 'angular-iscroll.js'), ['rebundle']);
    gulp.watch(paths.examples.index.src, ['views']);
    gulp.watch(path.join(paths.examples.src, '**/*.html'), ['demo-views']);
    gulp.watch([paths.examples.style.src,
        path.join(paths.examples.src, '**/*.scss')], ['style']);
});

gulp.task('examples', [
    'connect',
    'browser-sync',
    'style',
    'views',
    'watch-examples'
], bundle);

gulp.task('deploy', function () {
    return gulp.src('./dist/**/*')
        .pipe(ghPages());
});
