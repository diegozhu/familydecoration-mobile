(function() {
  'use strict';

  angular
    .module('fdmobile.settingsAbout')
    .config(settingsAbout);

  settingsAbout.$inject = ['$stateProvider'];

  function settingsAbout($stateProvider) {
    $stateProvider
      .state('settings-about', {
        url: '/settings/about',
        templateUrl: 'settings/about/about.html',
        controller: 'SettingsAboutController as vm'
      });
  }
})();
