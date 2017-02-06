(function() {
  'use strict';

  angular
    .module('fdmobile.settingsUpdate')
    .config(settingsUpdate);

  settingsUpdate.$inject = ['$stateProvider'];

  function settingsUpdate($stateProvider) {
    $stateProvider
      .state('settings-update', {
        url: '/settings/update',
        templateUrl: 'settings/update/update.html',
        controller: 'SettingsUpdateController as vm',
        cache: false
      });
  }
})();
