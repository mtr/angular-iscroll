var bump = require('gulp-bump'),
    cached = require('gulp-cached'),
    concat = require('gulp-concat'),
    dateFormat = require('dateformat'),
    filter = require('gulp-filter'),
    footer = require('gulp-footer'),
    ghPages = require('gulp-gh-pages'),
    git = require('gulp-git'),
    gulp = require('gulp'),
    header = require('gulp-header'),
    jshint = require('gulp-jshint'),
    gulpNgAnnotate = require('gulp-ng-annotate'),
    pkg = require('./package.json'),
    path = require('path'),
    pump = require('pump'),
    remember = require('gulp-remember'),
    rename = require('gulp-rename'),
    tag_version = require('gulp-tag-version'),
    uglify = require('gulp-uglify'),
    bundleName = 'angular-iscroll.js',
    paths = {
        lib: {
            src: path.join('src/lib', bundleName),
            dest: 'dist/lib/'
        }
    };

function _getNow() {
    return new Date();
}

gulp.task('scss', function () {
    return gulp.src('src/lib/_*.scss')
        .pipe(gulp.dest('dist/lib/scss'));
});

gulp.task('lib', function (cb) {
    var now = _getNow();

    pump([
            gulp.src(paths.lib.src),
            cached('lib'),            // Only pass through changed files.
            jshint(),
            header('/**\n' +
                ' * @license <%= pkg.name %> v<%= pkg.version %>, <%= now %>\n' +
                ' * (c) <%= years %> <%= pkg.author.name %> <<%= pkg.author.email %>>\n' +
                ' * License: <%= pkg.license %>\n' +
                ' */\n', {
                now: dateFormat(now, "isoDateTime"),
                years: dateFormat(now, "yyyy"),
                pkg: pkg
            }),
            footer('\n'),
            remember('lib'),          // Add back all files to the stream.
            concat('angular-iscroll.js'), // Do things that require all files.
            gulpNgAnnotate(),
            gulp.dest(paths.lib.dest),
            uglify({output: {comments: /^!|@preserve|@license|@cc_on/i}}),
            rename({
                extname: '.min.js'
            }),
            gulp.dest(paths.lib.dest)
        ],
        cb
    );

});

gulp.task('watch', function () {
    var watcher = gulp.watch(paths.lib.src, ['lib']);

    gulp.watch('src/lib/_*.scss', ['scss']);

    watcher.on('change', function _srcChanged(event) {
        if (event.type === 'deleted') {
            delete cached.caches.lib[event.path];
            remember.forget('lib', event.path);
        }
    });
});

gulp.task('default', ['scss', 'lib']);

function increaseVersion(importance) {
    // Get all the files to bump version in.
    return gulp.src(['./package.json', './bower.json'])
    // Bump the version number in those files.
        .pipe(bump({type: importance}))
        // Save it back to filesystem.
        .pipe(gulp.dest('./'))
        // Commit the changed version number.
        .pipe(git.commit('Bumped package version.'))

        // Read only one file to get the version number.
        .pipe(filter('package.json'))
        // Tag it in the repository.
        .pipe(tag_version());
}

/**
 * Bumping version number and tagging the repository with it.
 * Please read http://semver.org/
 *
 * You can use the commands
 *
 *     gulp patch     # makes v0.1.0 → v0.1.1
 *     gulp feature   # makes v0.1.1 → v0.2.0
 *     gulp release   # makes v0.2.1 → v1.0.0
 *
 * To bump the version numbers accordingly after you did a patch,
 * introduced a feature, or made a backwards-incompatible release.
 */
gulp.task('patch', function () {
    return increaseVersion('patch');
});
gulp.task('feature', function () {
    return increaseVersion('minor');
});
gulp.task('release', function () {
    return increaseVersion('major');
});

gulp.task('deploy', function () {
    return gulp.src('./dist/**/*')
        .pipe(ghPages());
});
