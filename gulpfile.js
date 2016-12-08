var gulp = require('gulp');
var sass = require('gulp-sass');
var nodemon = require('gulp-nodemon');
var uglify = require('gulp-uglify');
var autoprefixer = require('gulp-autoprefixer');
var cleancss = require('gulp-clean-css');
var sourcemaps = require('gulp-sourcemaps');
var pump = require('pump');
var preprocess = require('gulp-preprocess');

// tasks

gulp.task('runserver', function() {
	nodemon({
		script: 'server.js',
		ext: 'js',
		ignore: ['src/*', 'dest/*'],
                args: ['--config', 'notecloudrc'],
		env: {
			NODE_ENV: 'development',
		}
	});
});

gulp.task('compilehtml', function(cb) {
	pump([
		gulp.src([
			'src/html/*.html',
			'!src/html/*.frag'
		]),
		preprocess(),
		gulp.dest('static/html/')
	], cb);
});

gulp.task('copylibs', function() {
	return gulp.src('src/lib/*')
		.pipe(gulp.dest('static/js/lib/'));
});

gulp.task('compilejs', function(cb) {
	pump([
		gulp.src('src/js/*'),
		uglify(),
		gulp.dest('static/js/')
	], cb);
})

gulp.task('compilescss', function(cb) {
	pump([
		gulp.src('src/scss/*'),
		sourcemaps.init(),
		sass(),
		autoprefixer({
			browsers: ['last 2 versions'],
			cascade: false
		}),
		cleancss(),
		sourcemaps.write(),
		gulp.dest('static/css/')
	], cb);
});

gulp.task('watch', function() {
	gulp.watch('src/js/*', ['compilejs']);
	gulp.watch('src/html/*', ['compilehtml']);
	gulp.watch('src/scss/*', ['compilescss']);
	gulp.watch('src/libs/*', ['copylibs']);
})

gulp.task('default', [
	'compilejs',
	'compilescss',
	'copylibs',
	'compilehtml',
	'watch',
	'runserver'
])
