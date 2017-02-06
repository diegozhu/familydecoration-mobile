'use strict';
var gulp = require('gulp'),
  minimist = require('minimist'),
  requireDir = require('require-dir'),
  chalk = require('chalk'),
  fs = require('fs');

var paths = gulp.paths = {
  apps: ['fd_mobile'],

  bowerComponents: 'bower_components',
  common: 'common',
  dist: 'www',
  
  contrib: ['gulpfile.js', 'gulp/**/*.js', 'hooks/**/*.js'],
  karma: ['test/karma/**/*.js'],
  protractor: ['test/protractor/**/*.js']
};

var options = gulp.options = minimist(process.argv.slice(2)),
    task = options._[0],
    gulpSettings,
    app = options.app,
    hasApp = !!(paths.apps.indexOf(app) + 1),
    common = paths.common;

if (hasApp) {
  paths.jsFiles = [app + '/**/*.js', '!' + app + '/bower_components/**/*.js'];
  paths.jsonFiles = [app + '/**/*.json', '!' + app + '/bower_components/**/*.json'];
  paths.templates = [app + '/*/**/*.html', '!' + app + '/bower_components/**/*.html'];
  paths.scssFiles = [app + '/*/styles/**/*.scss'];
  paths.cssFiles = ['.tmp/' + app + '/*/styles/*.css'];

  paths.watchFiles = paths.jsFiles
    .concat([app + '/index.html', app + '/**/assets/**/*'])
    .concat(paths.templates);

  switch (app) {
    case 'fd_mobile':
      paths.bowerComponentsRes = [paths.bowerComponents + '/**/*'];
      paths.fontsRes = [common + '/assets/fonts/*'];
      break;
  }
}

if (fs.existsSync('./gulp/.gulp_settings.json')) {
  gulpSettings = require('./gulp/.gulp_settings.json');
  var defaults = gulpSettings.defaults;

  if (defaults) {
    // defaults present for said task?
    if (task && task.length && defaults[task]) {
      var taskDefaults = defaults[task];
      // copy defaults to options object
      for (var key in taskDefaults) {
        // only if they haven't been explicitly set
        if (options[key] === undefined) {
          options[key] = taskDefaults[key];
        }
      }
    }
  }

  if (defaults && defaults[task]) {
    console.log(chalk.green('defaults for task \'' + task + '\': '), defaults[task]);
  }
}

// cordova command one of cordova's build commands?
if (options.cordova) {
  var cmds = ['build', 'run', 'emulate', 'prepare', 'serve'];
  for (var i = 0, cmd; ((cmd = cmds[i])); i++) {
    if (options.cordova.indexOf(cmd) >= 0) {
      options.cordovaBuild = true;
      break;
    }
  }
}

// load tasks
requireDir('./gulp');

// default task
gulp.task('default', function() {
  if (hasApp) {
    // cordova build command & gulp build
    if (options.cordovaBuild && options.build !== false) {
      return gulp.start('cordova-with-build');
    }
    // cordova build command & no gulp build
    else if (options.cordovaBuild && options.build === false) {
      return gulp.start('cordova-only-resources');
    }
    // cordova non-build command
    else if (options.cordova) {
      return gulp.start('cordova');
    }
    // livereload command
    else if (options.livereload) {
      options.build = false; // build not necessary, take whatever's in www
      return gulp.start('livereload');
    }
    // just watch when cordova option not present
    else {
      return gulp.start('watch');
    }
  } else {
    console.log(chalk.red('app [' + app + '] not exists.'));
  }
});
