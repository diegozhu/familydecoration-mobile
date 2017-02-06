(function() {
  'use strict';

  angular
    .module('fdmobile.settingsDevice')
    .config(settingsDevice);

  settingsDevice.$inject = ['$stateProvider'];

  function settingsDevice($stateProvider) {
    $stateProvider
      .state('settings-device', {
        url: '/settings/device',
        templateUrl: 'settings/device/device.html',
        controller: 'SettingsDeviceController as vm'
      });
  }
})();
