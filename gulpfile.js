'use strict';

// Gulp libs
var gulp = require('gulp');
var fs = require('fs-extra');
var path = require('path');
var templateCache = require('gulp-angular-templatecache');
var template = require('gulp-template');
var exec = require('child_process').exec;
var $ = require('gulp-load-plugins')();
var runSequence = require('run-sequence');
var gutil = require('gulp-util');
var order = require('gulp-order');

// Default environment specific variables
var srcDirectory = path.join(__dirname, '/src');
var distDirectory = path.join(__dirname, '/typeset_buddy_extension');
var paths = {
	app: path.join(srcDirectory, 'app'),
	content: path.join(srcDirectory, 'content'),
	css: path.join(srcDirectory, 'css'),
	less: path.join(srcDirectory, 'css', 'less'),
	deps: path.join(__dirname, 'bower_components'),
	additionalLibs: path.join(srcDirectory , 'libs'),
	js:  path.join(srcDirectory, 'js'),
	destjs: path.join(distDirectory, 'js'),
	destcss: path.join(distDirectory, 'css'),
	destfonts: path.join(distDirectory, 'fonts'),
	destJsx: path.join(distDirectory, 'jsx'),
	destcsxs: path.join(distDirectory, 'CSXS'),
};

var packageFile = getPackageFile();
var appFileName = packageFile.name.toLowerCase();
var minifyStyles = false;
var isProd = false;

// Helper functions
function plumber() {
	return $.plumber({errorHandler: $.notify.onError(
		function (error) {
			return 'Error line ' + error.lineNumber + ' in ' + error.fileName + '\n' + error.message;
		}
	)});
}

function checkFilesExist(files){
	files.forEach(function(f){
		fs.stat(f, function(err, stat){
			if(err != null) {
				console.log('Missing file: ' + f);
				return false;
			}
		})
	});
	return true;
}

function getPackageFile(){
	return JSON.parse(fs.readFileSync('./package.json'));
}

// Main build tasks
gulp.task('default', ['build']);

gulp.task('build', function(callback){
	runSequence(
		'sass',
		'copyCss',
		'copyFonts',
		'templates',
		'buildJs',
		'render',
		'copyManifest',
		'copyJsx',
		'copyAdobeLibs',
		callback
	);
});

gulp.task('buildDebug', function(callback){
	runSequence(
		'build',
		'copyDebugFile',
		callback
	);
});

gulp.task('buildAll', function(callback){
	runSequence(
		'buildDeps',
		'build',
		callback
	);
});

gulp.task('buildDist', function(callback){
	runSequence(
		'setProdVariables',
		'build',
		'minJs',
		'minCss',
		callback
	);
});

gulp.task('buildAllDist', function(callback){
	runSequence(
		'buildDeps',
		'buildDist',
		callback
	);
});

gulp.task('setProdVariables', function(){
	minifyStyles = true;
	isProd = true;
});

gulp.task('clean', function () {
	exec('rm -rf ' + distDirectory, function (err, stdout, stderr) {
		if (err) { throw err;	}
		else { console.log('clean complete');	}
	});
});

gulp.task('copyCss', function(){
	var files = [
		path.join(paths.css, 'animate.min.css'),
		path.join(paths.css, 'bootstrap.min.css'),
		path.join(paths.css, 'ngToast.min.css'),
		path.join(paths.css, 'topcoat-desktop-dark.css'),
		path.join(paths.css, 'topcoat-desktop-light.css'),
	];
	if(checkFilesExist(files)){
		return gulp.src(files)
		.pipe(plumber())
		.pipe(gulp.dest(paths.destcss));
	}
});

gulp.task('copyManifest', function(){
	var files = [
		path.join(srcDirectory, 'CSXS/manifest.xml'),
	];
	if(checkFilesExist(files)){
		return gulp.src(files)
		.pipe(plumber())
		.pipe(gulp.dest(paths.destcsxs));
	}
});

gulp.task('copyFonts', function(){
	var files = [
		path.join(paths.deps, 'bootstrap/fonts/*'),
		path.join(paths.deps, 'topcoat/font/SourceSansPro-Light.otf'),
		path.join(paths.deps, 'topcoat/font/SourceSansPro-Regular.otf'),
		path.join(paths.deps, 'topcoat/font/SourceSansPro-Semibold.otf'),
	];
	return gulp.src(files)
	.pipe(plumber())
	.pipe(gulp.dest(paths.destfonts));
});

gulp.task('copyJsx', function(){
	var files = [
		path.join(srcDirectory, 'adobe/*.jsx'),
	];
	return gulp.src(files)
	.pipe(plumber())
	.pipe(gulp.dest(paths.destJsx));
});

gulp.task('copyAdobeLibs', function(){
	var files = [
		path.join(srcDirectory, 'adobe/*.js'),
	];
	return gulp.src(files)
	.pipe(plumber())
	.pipe(gulp.dest(paths.destjs));
});

gulp.task('copyDebugFile', function(){
	var files = [
		path.join(srcDirectory, '.debug'),
	];
	if(checkFilesExist(files)){
		return gulp.src(files)
		.pipe(plumber())
		.pipe(gulp.dest(distDirectory));
	}
});

// Compile sass into a single css file
gulp.task('sass', function (callback){
	var files = [
		// path.join(paths.css, 'app.scss')
		path.join(paths.css, 'app.css')
	];
	if(checkFilesExist(files)){
		return gulp.src(files)
		.pipe(plumber())
		// .pipe($.sass({}))
		.pipe($.rename(appFileName + '.css'))
		.pipe(gulp.dest(paths.destcss));
	}
});

gulp.task('minCss', function(){
	return gulp.src(path.join(paths.destcss, appFileName + '.css'))
	.pipe(plumber())
	.pipe($.cleanCss())
	.pipe($.rename(appFileName + '.min.css'))
	.pipe(gulp.dest(paths.destcss));
});

gulp.task('buildJs', function(){
	var files = [
		path.join(srcDirectory, 'app/*.js'),
		path.join(srcDirectory, 'components/**/*.js'),
	];
	var stream = gulp.src(files)
	.pipe(plumber())
	.pipe($.order([
		'polyfills.js',
		'app.js',
		'constant.js',
		'utils.service.js',
		'app.config.js',
		'app.run.js',
		'api.service.js',
		'*/**/*.config.js',
		'*/**/*.js'
	]))
	// .pipe($.sourcemaps.init())
	.pipe($.concat(appFileName + '.js'))
	// .pipe($.sourcemaps.write())
	.pipe($.replace('appNamePlaceholder', '\'' + packageFile.name + '\''))
	.pipe($.replace('appVersionPlaceholder', '\'' + packageFile.version + '\''));

	if(isProd) {
		stream.pipe($.replace('appDebugPlaceholder', 'false'));
	}
	else {
		stream.pipe($.replace('appDebugPlaceholder', 'true'));
	}
	return stream.pipe(gulp.dest(paths.destjs));
});

gulp.task('minJs', function(){
	var files = [
		path.join(paths.destjs, appFileName + '.js'),
		path.join(paths.destjs, 'templates.js')
	];
	if(checkFilesExist(files)){
		return gulp.src(files)
		.pipe(plumber())
		.pipe($.concat(appFileName + '.min.js'))
		.pipe($.babel({presets: ['es2015'], compact:true}))
		.pipe($.uglify())
		.pipe(gulp.dest(paths.destjs));
	}
});

gulp.task('buildDeps', function(){
	var files = [
		path.join(paths.deps, 'jquery/dist/jquery.js'),
		path.join(paths.deps, 'angular/angular.js'),
		path.join(paths.deps, 'angular-sanitize/angular-sanitize.js'),
		path.join(paths.deps, 'angular-ui-router/release/angular-ui-router.js'),
		path.join(paths.deps, 'angular-bootstrap/ui-bootstrap-tpls.js'),
		path.join(paths.deps, 'angular-loading-bar/build/loading-bar.js'),
		path.join(paths.deps, 'ngToast/dist/ngToast.js'),
		path.join(paths.deps, 'ngstorage/ngStorage.js'),
	];
	if(checkFilesExist(files)){
		return gulp.src(files)
		.pipe(plumber())
		.pipe($.order([
			'jquery.js',
			'angular.js',
			'angular-sanitize.js',
			'angular-ui-router.js',
			'ui-bootstrap-tpls.js',
			'loading-bar.js',
		]))
		.pipe($.concat('deps.js'))
		.pipe(gulp.dest(paths.destjs))
		.pipe($.uglify())
		.pipe($.rename({extname: '.min.js'}))
		.pipe(gulp.dest(paths.destjs));
	}
});

// Watch Tasks
gulp.task('watch', function () {
	gulp.watch('./package.json', ['build'])
	gulp.watch([path.join(srcDirectory, '/**/*.scss'), path.join('./src', '/**/*.css')], ['sass']);
	gulp.watch(path.join(srcDirectory, '/**/*.tpl.html'), ['templates']);
	gulp.watch(path.join(srcDirectory, '/**/*.js'), ['buildJs']);
	gulp.watch(path.join(srcDirectory, 'index.template.html'), ['render']);
	gulp.watch(path.join(srcDirectory, '/jsx/*.jsx'), ['copyJsx']);
});

// Precompile the Angular templates to avoid ajax calls for every template path
gulp.task('templates', function(){
	var files = [
		path.join(srcDirectory, '**/*.tpl.html'),
	];
	return gulp.src(files)
	.pipe($.order([]))
	.pipe(templateCache('templates.js', {
		module: 'templates',
		standalone: true,
		transformUrl: function (url) {
			var split = url.split(path.sep);
			return split[split.length - 1];
		}
	}))
	.pipe(gulp.dest(paths.destjs));
});

// Use the index-template to render the index.html file
gulp.task('render', function(){
	return gulp.src(path.join(srcDirectory, 'index.template.html'))
	.pipe(template({isProd: isProd, appFileName: appFileName}))
	.pipe($.replace('appVersion', packageFile.version))
	.pipe($.rename('index.html'))
	.pipe(gulp.dest(distDirectory));
});