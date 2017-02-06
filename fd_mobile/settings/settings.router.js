(function() {
  'use strict';

  angular
    .module('fdmobile.settings')
    .config(settingsRouter);

  settingsRouter.$inject = ['$stateProvider'];

  function settingsRouter($stateProvider) {
    $stateProvider
      .state('settings', {
        url: '/settings',
        templateUrl: 'settings/settings.html',
        controller: 'SettingsController as vm',
        cache: false
      });
  }
})();
