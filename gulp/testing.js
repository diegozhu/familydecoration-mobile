var gulp = require('gulp'),
  path = require('path'),
  $ = require('gulp-load-plugins')(),
  Server = require('karma').Server,
  bs = require('browser-sync'),
  paths = gulp.paths,
  options = gulp.options;

// KARMA
function runKarma(singleRun, done) {
  new Server({
    configFile: path.join(__dirname, '/../karma.conf.js'),
    singleRun: singleRun,
    autoWatch: !singleRun
  }, done).start();
}

gulp.task('karma', ['linting'], function(done) {
  runKarma(true, done);
});

gulp.task('karma:auto', ['linting'], function(done) {
  runKarma(false, done);
});

// PROTRACTOR
// Downloads the selenium webdriver
gulp.task('webdriver-update', $.protractor.webdriver_update);
gulp.task('webdriver-standalone', $.protractor.webdriver_standalone);

function runProtractor(done) {
  gulp.src(paths.protractor)
    .pipe($.protractor.protractor({
      configFile: 'protractor.conf.js'
    }))
    .on('error', function(err) {
      // Make sure failed tests cause gulp to exit non-zero
      throw err;
    })
    .on('end', function () {
      bs.get('m-ionic').exit();
      done();
    });
}

gulp.task('protractor', ['serve', 'linting', 'webdriver-update'], function(done) {
  runProtractor(done);
});

var protractorBuildDeps = ['serve-build', 'webdriver-update'];
if (options.build !== false) {
  protractorBuildDeps.push('build');
}

gulp.task('protractor-build', protractorBuildDeps, function(done) {
  gulp.start('linting');
  runProtractor(done);
});
