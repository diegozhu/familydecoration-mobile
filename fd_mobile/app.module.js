(function() {
  'use strict';

  angular.module('fdmobile', [
    // public modules
    'ionic',
    'angular-md5',
    'ngCordova',
    'ngResource',
    'ngMessages',
    'ui.router',
    'pascalprecht.translate',
    'angular-svg-round-progressbar',
    'counter',
    'mwl.calendar',
    'angular-google-analytics',
    // app modules
    'fdmobile.security',
    'fdmobile.home',
    'fdmobile.project',
    'fdmobile.settings',
    'fdmobile.profile',
    'fdmobile.logging'
  ]);
})();
