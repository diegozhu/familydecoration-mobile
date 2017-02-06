(function() {
  'use strict';

  angular.module('fdmobile', [
    // public modules
    'ionic',
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
    'fdmobile.settings',
    'fdmobile.profile',
    'fdmobile.logging'
  ]);
})();
