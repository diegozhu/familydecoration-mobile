(function() {
  'use strict';

  angular
    .module('fdmobile.settingsContact')
    .config(SettingsContactRouter);

  SettingsContactRouter.$inject = ['$stateProvider'];

  function SettingsContactRouter($stateProvider) {
    $stateProvider
      .state('settings-contact', {
        url: '/settings/contact',
        templateUrl: 'settings/contact/contact.html',
        controller: 'SettingscontactController as vm'
      });
  }
})();
