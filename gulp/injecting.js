var gulp = require('gulp'),
  $ = require('gulp-load-plugins')(),
  wiredep = require('wiredep'),
  mainBowerFiles = require('main-bower-files'),
  paths = gulp.paths,
  options = gulp.options,
  app = options.app,
  env = options.env || 'localhost';

var taskSequence = ['bowerComponentsRes', 'fontsRes', 'variables', 'styles', 'wiredep', 'bower-fonts', 'constants'];

// inject app/**/*.js, bower components, css into index.html
// inject environment variables into config.js constant
gulp.task('inject-all', taskSequence, function() {

  return gulp.src(app + '/index.html')
    .pipe(
      $.inject( // app/**/*.js files
        gulp.src(paths.jsFiles)
          .pipe($.plumber()) // use plumber so watch can start despite js errors
          .pipe($.naturalSort())
          .pipe($.angularFilesort()),
        {relative: true}))
    .pipe(
      $.inject( // inject compiled css
        gulp.src(paths.cssFiles, {read: false})
          .pipe($.naturalSort()),
        {
          ignorePath: '../.tmp/' + app,
          relative: true,
        }))
    .pipe(gulp.dest(app));
});

gulp.task('bowerComponentsRes', function() {
  var DEST = app + '/bower_components';

  return gulp.src(paths.bowerComponentsRes)
    .pipe($.changed(DEST))
    .pipe(gulp.dest(DEST));
});

gulp.task('fontsRes', function() {
  var DEST = app + '/assets/fonts';

  return gulp.src(paths.fontsRes)
    .pipe($.changed(DEST))
    .pipe(gulp.dest(DEST));
});

gulp.task('variables', function() {
  return gulp.src(app + '/*/styles/style.scss')
    .pipe(
      $.inject(
        gulp.src(app + '/common/constants/version'),
        {
          starttag: '/*inject:variables*/',
          endtag: '/*endinject*/',
          transform: function (filePath, file) {
            return gulp.options.cordova ? "$path: '..';" : "$path: '../..';";
          }
        }))
    .pipe(gulp.dest(app + '/'));
});

// build styles to tmp
gulp.task('styles', ['clean', 'bowerComponentsRes'], function() {
  // compile css starting from each module's scss
  return gulp.src(app + '/*/styles/!(_)*.scss')
    .pipe($.plumber())
    // .pipe($.sourcemaps.init())
    .pipe($.sass.sync().on('error', $.sass.logError))
    // .pipe($.sourcemaps.write())
    .pipe($.autoprefixer({ browsers: ['last 2 versions'], remove: false}))
    .pipe(gulp.dest('.tmp/' + app));
});

// inject bower components into index.html
gulp.task('wiredep', ['bowerComponentsRes', 'styles'], function() {

  return gulp.src(app + '/index.html')
    // exclude ionic scss since we're using ionic sass
    .pipe(wiredep.stream({
      directory: app + '/bower_components',
      exclude: [app + '/bower_components/ionic/release/css']
    }))
    .pipe(gulp.dest(app + '/'));
});

// copy bower fonts
gulp.task('bower-fonts', function() {
  var DEST = app + '/assets/fonts';
  var fontFiles = mainBowerFiles({filter: /\.(eot|otf|svg|ttf|woff|woff2)$/i})
    .concat(app + '/assets/fonts/**/*');

  return gulp.src(fontFiles)
    // only pass through changed files
    .pipe($.changed(DEST))
    .pipe(gulp.dest(DEST));
});

function injectFormat(obj, type) {
  // indentation of 2
  obj = JSON.stringify(obj, null, 2);
  // replace all doublequotes with singlequotes
  if (type === 'style') {
    obj = obj.replace(/\"/g, '');
  } else {
    obj = obj.replace(/\"/g, '\'');
  }
  // remove first and last line curly braces
  obj = obj.replace(/^\{\n/, '').replace(/\n\}$/, '');
  // remove indentation of first line
  obj = obj.replace(/^( ){2}/, '');
  // insert padding for all remaining lines
  if (type !== 'style') {
    obj = obj.replace(/\n( ){2}/g, '\n      ');
  }

  return obj;
};

gulp.task('constants', function() {
  return gulp.src(app + '/*/constants/constants.js')
    .pipe(
      $.inject(
        gulp.src(app + '/*/constants/env-' + env + '.json'),
        {
          starttag: '/*inject:constants*/',
          endtag: '/*endinject*/',
          transform: function (filePath, file) {
            var json;
            try {
              json = JSON.parse(file.contents.toString('utf8'));
            } catch (e) {
              console.log(e);
            }

            if (json) {
              json = injectFormat(json);
            }
            return json;
          }
        }))
    .pipe(
      $.inject(
        gulp.src(app + '/common/constants/version'),
        {
          starttag: '/*inject:version*/',
          endtag: '/*endinject*/',
          transform: function (filePath, file) {
            return "'VERSION': '" + options.appversion + "',";
          }
        }))
    .pipe(gulp.dest(app + '/'));
});
