(function() {
  'use strict';

  angular.module('fdmobile', [
    // public modules
    'ionic',
    'ionic-datepicker',
    'angular-md5',
    'angular.filter',
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
    'fdmobile.plan',
    'fdmobile.settings',
    'fdmobile.profile',
    'fdmobile.logging'
  ]);
})();
